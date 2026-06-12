class MovementEngine {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  validateMove(player, tokenIndex, steps) {
    const token = player.tokens[tokenIndex];
    if (token.status === 'finished') return false;
    if (token.status === 'home') return steps === 6;
    if (token.status === 'yard') return false;

    const path = this.game.paths[token.color];
    const homePath = this.game.getHomeColumn(token.color);
    const current = token.pathIndex;
    const total = path.length + homePath.length - 1;

    return current + steps <= total;
  }

  move(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (token.status === 'yard' && this.game.diceValue === 6) {
      return this.enterBoard(player, tokenIndex);
    }
    if (token.status === 'home' && this.game.diceValue === 6) {
      return this.enterBoard(player, tokenIndex);
    }
    if (token.status === 'onTrack') {
      return this.advance(player, tokenIndex);
    }
    return null;
  }

  enterBoard(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    const start = this.game.paths[token.color][0];
    token.status = 'onTrack';
    token.pathIndex = 0;
    token.r = start.r;
    token.c = start.c;
    const captured = this.game.checkCapture(player, token);
    const state = this.game.getState();
    return { token, state, captured };
  }

  advance(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    const steps = this.game.diceValue;
    const path = this.game.paths[token.color];
    const homePath = this.game.getHomeColumn(token.color);
    const newIndex = token.pathIndex + steps;

    if (newIndex >= path.length) {
      const homeIdx = newIndex - path.length;
      if (homeIdx >= homePath.length) return null;

      token.status = homeIdx === homePath.length - 1 ? 'finished' : 'homeColumn';
      token.pathIndex = newIndex;
      token.homeColumnIndex = homeIdx;
      const pos = homePath[homeIdx];
      token.r = pos.r;
      token.c = pos.c;

      if (token.status === 'finished') {
        this.game.moveCounts[player.color] = (this.game.moveCounts[player.color] || 0) + 1;
        const extra = this.game.checkWinCondition(player);
        const state = this.game.getState();
        return { token, state, extraTurn: extra };
      }

      const state = this.game.getState();
      return { token, state };
    }

    token.pathIndex = newIndex;
    const pos = path[newIndex];
    token.r = pos.r;
    token.c = pos.c;
    const captured = this.game.checkCapture(player, token);
    const extraTurn = captured !== false;
    const state = this.game.getState();
    return { token, state, captured, extraTurn };
  }

  highlightValidMoves(player) {
    return (player.tokens || []).filter((t, i) => {
      if (t.status === 'finished') return false;
      if (t.status === 'yard' || t.status === 'home') {
        return this.game.diceValue === 6;
      }
      return this.validateMove(player, i, this.game.diceValue);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MovementEngine;
}
