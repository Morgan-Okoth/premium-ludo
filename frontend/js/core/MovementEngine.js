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
    const homePath = this.game.homeColumns[token.color];
    const current = token.pathIndex;
    const total = path.length + homePath.length - 1;

    return current + steps <= total;
  }

  canEnterHomeLane(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (token.status !== 'onTrack') return false;
    
    const path = this.game.paths[token.color];
    const homePath = this.game.homeColumns[token.color];
    const homeEntry = homePath[0];
    
    const stepsNeeded = path.length - token.pathIndex;
    return stepsNeeded <= path.length;
  }

  canFinishToken(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (token.status !== 'onTrack') return false;
    
    const path = this.game.paths[token.color];
    const homePath = this.game.homeColumns[token.color];
    const steps = token.pathIndex;
    
    const remainingToHome = path.length - steps;
    const exactFinishRoll = remainingToHome + homePath.length - 1;
    
    return exactFinishRoll <= path.length + homePath.length - 1;
  }

  isOvershootMove(player, tokenIndex, steps) {
    const token = player.tokens[tokenIndex];
    if (token.status !== 'onTrack') return false;
    
    const path = this.game.paths[token.color];
    const homePath = this.game.homeColumns[token.color];
    const total = path.length + homePath.length - 1;
    const newIndex = token.pathIndex + steps;
    
    return newIndex > total;
  }

  move(player, tokenIndex, steps) {
    const token = player.tokens[tokenIndex];
    const effectiveSteps = steps !== undefined ? steps : this.game.diceValue;

    if (token.status === 'yard' && effectiveSteps === 6) {
      return this.enterBoard(player, tokenIndex);
    }
    if (token.status === 'home' && effectiveSteps === 6) {
      return this.enterBoard(player, tokenIndex);
    }
    if (token.status === 'onTrack') {
      return this.advance(player, tokenIndex, effectiveSteps);
    }
    return null;
  }

  animateMove(player, tokenIndex, onComplete) {
    const token = player.tokens[tokenIndex];
    if (typeof document === 'undefined') {
      if (onComplete) onComplete();
      return;
    }
    const cell = document.querySelector(`.cell[data-r="${token.r}"][data-c="${token.c}"]`);
    if (!cell) {
      if (onComplete) onComplete();
      return;
    }
    const tokenEl = cell.querySelector(`.token.${token.color}`);
    if (tokenEl) {
      tokenEl.classList.add('move-anim');
      setTimeout(() => {
        tokenEl.classList.remove('move-anim');
        if (onComplete) onComplete();
      }, 500);
    } else {
      if (onComplete) onComplete();
    }
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

  advance(player, tokenIndex, steps) {
    const token = player.tokens[tokenIndex];
    const path = this.game.paths[token.color];
    const homePath = this.game.homeColumns[token.color];
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
