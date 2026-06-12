class GameEngine {
  constructor(playerCount = 4, names = null, mode = 'classic') {
    this.sides = playerCount;
    this.mode = mode;
    this.colors = mode === 'hex'
      ? ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
      : ['red', 'green', 'yellow', 'blue'];
    this.players = names
      ? names.map((name, i) => ({ name, color: this.colors[i], ai: false }))
      : this.colors.map((color, i) => ({ name: color, color, ai: false }));
  }

    this.paths = {};
    this.homeColumns = {};
    this.currentPlayer = 0;
    this.diceValue = null;
    this.turnPhase = 'roll'; // 'roll' | 'move'
    this.consecutiveSixes = 0;
    this.maxConsecutiveSixes = 3;
    this.winner = null;
    this.captures = {};
    this.moveCounts = {};

    this.initPaths();
  }

  initPaths() {
    this.paths = {
      red: this.generatePath('red'),
      green: this.generatePath('green'),
      yellow: this.generatePath('yellow'),
      blue: this.generatePath('blue'),
    };

    this.homeColumns = {
      red: Array.from({ length: 5 }, () => ({ r: 6, c: 1 + this.homeColumns.red?.length ?? 0 })).slice(0, 5),
      green: Array.from({ length: 5 }, () => ({ r: 1 + (this.homeColumns.green?.length ?? 0), c: 6 })).slice(0, 5),
      yellow: Array.from({ length: 5 }, () => ({ r: 8 - (this.homeColumns.yellow?.length ?? 0), c: 13 })).slice(0, 5),
      blue: Array.from({ length: 5 }, () => ({ r: 13, c: 8 - (this.homeColumns.blue?.length ?? 0) })).slice(0, 5),
    };
  }

  getHomeColumn(color) {
    if (this.homeColumns[color].length === 0) {
      this.homeColumns[color] = Array.from({ length: 5 }, (_, i) => {
        if (color === 'red') return { r: 6, c: 1 + i };
        if (color === 'green') return { r: 1 + i, c: 6 };
        if (color === 'yellow') return { r: 13 - i, c: 8 };
        if (color === 'blue') return { r: 8, c: 13 - i };
        return { r: 0, c: 0 };
      });
    }
    return this.homeColumns[color];
  }

  generatePath(color) {
    const path = [];
    const positions = {
      red: { start: { r: 6, c: 1 }, type: 'home' },
      green: { start: { r: 1, c: 6 }, type: 'home' },
      yellow: { start: { r: 13, c: 8 }, type: 'home' },
      blue: { start: { r: 8, c: 13 }, type: 'home' },
    };

    const track = {
      red: [
        { r: 6, c: 0 }, { r: 6, c: 1 },
        { r: 5, c: 1 }, { r: 4, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 1 },
        { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 },
        { r: 0, c: 6 }, { r: 0, c: 7 },
        { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, { r: 6, c: 8 },
        { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 },
        { r: 7, c: 13 }, { r: 8, c: 13 },
        { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, { r: 8, c: 8 },
        { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 },
        { r: 13, c: 7 }, { r: 14, c: 7 },
        { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, { r: 8, c: 6 },
        { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 },
        { r: 7, c: 1 }, { r: 6, c: 1 },
      ],
      green: [
        { r: 1, c: 6 },
        { r: 1, c: 7 },
        { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 },
        { r: 6, c: 8 }, { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 },
        { r: 7, c: 12 }, { r: 7, c: 13 },
        { r: 8, c: 13 }, { r: 9, c: 13 }, { r: 10, c: 13 }, { r: 11, c: 13 }, { r: 12, c: 13 }, { r: 13, c: 13 },
        { r: 13, c: 12 }, { r: 13, c: 11 }, { r: 13, c: 10 }, { r: 13, c: 9 }, { r: 13, c: 8 },
        { r: 14, c: 8 }, { r: 14, c: 7 },
        { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, { r: 8, c: 6 },
        { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 },
        { r: 7, c: 1 }, { r: 6, c: 1 },
        { r: 6, c: 0 }, { r: 5, c: 0 }, { r: 4, c: 0 }, { r: 3, c: 0 }, { r: 2, c: 0 }, { r: 1, c: 0 },
        { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 },
      ],
      yellow: [
        { r: 13, c: 8 },
        { r: 13, c: 7 },
        { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 },
        { r: 8, c: 6 }, { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 },
        { r: 7, c: 2 }, { r: 7, c: 1 },
        { r: 6, c: 1 }, { r: 5, c: 1 }, { r: 4, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 1 },
        { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 },
        { r: 0, c: 6 }, { r: 0, c: 7 },
        { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, { r: 6, c: 8 },
        { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 },
        { r: 7, c: 13 }, { r: 8, c: 13 },
        { r: 9, c: 13 }, { r: 10, c: 13 }, { r: 11, c: 13 }, { r: 12, c: 13 }, { r: 13, c: 13 },
        { r: 13, c: 12 }, { r: 13, c: 11 }, { r: 13, c: 10 }, { r: 13, c: 9 },
      ],
      blue: [
        { r: 8, c: 13 },
        { r: 8, c: 12 },
        { r: 9, c: 12 }, { r: 10, c: 12 }, { r: 11, c: 12 }, { r: 12, c: 12 }, { r: 13, c: 12 },
        { r: 13, c: 11 }, { r: 13, c: 10 }, { r: 13, c: 9 }, { r: 13, c: 8 }, { r: 13, c: 7 },
        { r: 13, c: 6 }, { r: 14, c: 6 },
        { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, { r: 8, c: 6 },
        { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 },
        { r: 7, c: 1 }, { r: 6, c: 1 },
        { r: 6, c: 0 }, { r: 5, c: 0 }, { r: 4, c: 0 }, { r: 3, c: 0 }, { r: 2, c: 0 }, { r: 1, c: 0 },
        { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 },
        { r: 0, c: 5 }, { r: 0, c: 6 },
        { r: 0, c: 7 }, { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 },
        { r: 6, c: 8 }, { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 },
      ],
    };

    return track[color] || track.red;
  }

  rollDie() {
    if (this.diceValue !== null) return this.diceValue;
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    if (this.diceValue === 6) {
      this.consecutiveSixes++;
    } else {
      this.consecutiveSixes = 0;
    }
    this.turnPhase = 'move';
    return this.diceValue;
  }

  getMovableTokens(player) {
    const tokens = player.tokens || [];
    return tokens.filter(( token, idx) => token.status === 'home' ? false : token.status === 'yard' ? this.diceValue === 6 : this.pathIndexWithinBounds(token, this.diceValue));
  }

  pathIndexWithinBounds(token, steps) {
    if (token.status === 'finished') return false;
    const path = this.paths[token.color];
    const currentIndex = token.pathIndex ?? 0;
    const nextIndex = currentIndex + steps;

    if (token.status === 'home') {
      const homePath = this.getHomeColumn(token.color);
      return steps === 6 ? true : false;
    }

    if (token.status === 'homeColumn') {
      const homePath = this.getHomeColumn(token.color);
      const hcIndex = token.homeColumnIndex ?? 0;
      return hcIndex + steps < homePath.length;
    }

    const trackIndexAfterHome = this.paths[token.color].length;
    const totalLen = trackIndexAfterHome + this.getHomeColumn(token.color).length;
    return currentIndex + steps < totalLen;
  }

  moveToken(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (!token) return null;

    if (token.status === 'yard') {
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = this.paths[token.color][0];
      token.r = pos.r;
      token.c = pos.c;
      this.checkCapture(player, token);
      this.finishTurn(player, false);
      return { token, r: token.r, c: token.c, captured: false };
    }

    if (token.status === 'home') {
      if (this.diceValue !== 6) return null;
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = this.paths[token.color][0];
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      this.finishTurn(player, false);
      return { token, r: token.r, c: token.c, captured };
    }

    if (token.status === 'onTrack') {
      const steps = this.diceValue;
      const path = this.paths[token.color];
      const homePath = this.getHomeColumn(token.color);
      const trackLen = path.length;
      const homeLen = homePath.length;
      let newIndex = token.pathIndex + steps;

      if (newIndex >= trackLen) {
        const homeIndex = newIndex - trackLen;
        if (homeIndex < homeLen - 1) {
          token.status = 'homeColumn';
          token.homeColumnIndex = homeIndex;
          const pos = homePath[homeIndex];
          token.r = pos.r;
          token.c = pos.c;
          const captured = this.checkCapture(player, token);
          const extraTurn = this.checkHomeEntry(player, token);
          this.finishTurn(player, extraTurn);
          return { token, r: token.r, c: token.c, captured, extraTurn };
        } else if (homeIndex === homeLen - 1) {
          token.status = 'finished';
          token.pathIndex = newIndex;
          const pos = homePath[homeIndex];
          token.r = pos.r;
          token.c = pos.c;
          this.moveCounts[player.color] = (this.moveCounts[player.color] || 0) + 1;
          const extraTurn = this.checkWinCondition(player);
          this.finishTurn(player, extraTurn);
          return { token, r: token.r, c: token.c, captured: false, finished: true, extraTurn };
        } else {
          return null;
        }
      } else {
        token.pathIndex = newIndex;
        const pos = path[newIndex];
        token.r = pos.r;
        token.c = pos.c;
        const captured = this.checkCapture(player, token);
        const extraTurn = captured !== false;
        this.finishTurn(player, extraTurn);
        return { token, r: token.r, c: token.c, captured, extraTurn };
      }
    }

    return null;
  }

  checkCapture(player, token) {
    const pos = { r: token.r, c: token.c };
    if (this.isSafeSpot(pos)) return false;

    for (const otherPlayer of this.players) {
      if (otherPlayer.color === player.color) continue;
      for (const otherToken of otherPlayer.tokens) {
        if (otherToken.status === 'onTrack' && otherToken.r === pos.r && otherToken.c === pos.c) {
          otherToken.status = 'yard';
          otherToken.pathIndex = null;
          otherToken.homeColumnIndex = null;
          otherToken.r = null;
          otherToken.c = null;
          this.captures[player.color] = (this.captures[player.color] || 0) + 1;
          return true;
        }
      }
    }
    return false;
  }

  checkHomeEntry(player, token) {
    return token.status === 'finished';
  }

  checkWinCondition(player) {
    const allFinished = player.tokens.every((t) => t.status === 'finished');
    if (allFinished) {
      this.winner = player.color;
      return true;
    }
    return false;
  }

  finishTurn(player, extraTurn) {
    if (extraTurn) {
      this.diceValue = null;
      this.turnPhase = 'roll';
      return;
    }
    if (this.consecutiveSixes >= this.maxConsecutiveSixes) {
      this.consecutiveSixes = 0;
      this.currentPlayer = (this.currentPlayer + 1) % this.sides;
    } else {
      this.currentPlayer = (this.currentPlayer + 1) % this.sides;
    }
    this.diceValue = null;
    this.turnPhase = 'roll';
  }

  isSafeSpot(pos) {
    const safeSpots = [
      { r: 6, c: 1 },
      { r: 2, c: 1 },
      { r: 6, c: 8 },
      { r: 8, c: 8 },
      { r: 13, c: 8 },
      { r: 8, c: 13 },
      { r: 1, c: 6 },
      { r: 13, c: 6 },
      { r: 7, c: 0 },
      { r: 0, c: 7 },
      { r: 7, c: 14 },
      { r: 14, c: 7 },
    ];
    return safeSpots.some((s) => s.r === pos.r && s.c === pos.c);
  }

  getState() {
    return {
      players: this.players.map((p) => ({
        color: p.color,
        name: p.name,
        tokens: p.tokens,
        current: this.currentPlayer,
      })),
      diceValue: this.diceValue,
      turnPhase: this.turnPhase,
      consecutiveSixes: this.consecutiveSixes,
      winner: this.winner,
      captures: { ...this.captures },
    };
  }

  reset() {
    this.currentPlayer = 0;
    this.diceValue = null;
    this.turnPhase = 'roll';
    this.consecutiveSixes = 0;
    this.winner = null;
    this.captures = {};
    this.moveCounts = {};
    this.players.forEach((p) => {
      p.tokens = p.tokens.map((_, i) => ({
        id: `${p.color}-${i}`,
        color: p.color,
        status: 'yard',
        pathIndex: null,
        r: null,
        c: null,
        homeColumnIndex: null,
      }));
    });
  }

  validate() {
    const valid = this.players.every((p, i) => {
      if (this.winner) return true;
      const movable = this.getMovableTokens(p);
      if (movable.length === 0 && this.currentPlayer === i) {
        return true;
      }
      return true;
    });
    return valid;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameEngine;
}
