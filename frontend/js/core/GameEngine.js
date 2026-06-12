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

    this.paths = {};
    this.homeColumns = {};
    this.pathGenerator = new PathGenerator();
    this.currentPlayer = 0;
    this.diceValue = null;
    this.turnPhase = 'roll';
    this.consecutiveSixes = 0;
    this.maxConsecutiveSixes = 3;
    this.winner = null;
    this.captures = {};
    this.moveCounts = {};

    this.initPaths();
  }

  initPaths() {
    this.paths = {};
    this.homeColumns = {};
    for (const color of this.colors) {
      this.paths[color] = this.generatePath(color);
      this.homeColumns[color] = this.generateHomeColumn(color);
    }
  }

  generatePath(color) {
    if (this.mode === 'hex') return this.pathGenerator.getHexPath(color);
    return this.pathGenerator.getClassicPath(color);
  }

  generateHomeColumn(color) {
    if (this.mode === 'hex') return this.pathGenerator.generateHomeLane(color);
    const dirs = {
      red:    { start: { r: 6, c: 1 }, step: (p) => ({ ...p, c: p.c + 1 }) },
      green:  { start: { r: 1, c: 6 }, step: (p) => ({ ...p, r: p.r + 1 }) },
      yellow: { start: { r: 8, c: 13 }, step: (p) => ({ ...p, c: p.c - 1 }) },
      blue:   { start: { r: 13, c: 8 }, step: (p) => ({ ...p, r: p.r - 1 }) },
      orange: { start: { r: 6, c: 1 }, step: (p) => ({ ...p, c: p.c + 1 }) },
      purple: { start: { r: 1, c: 6 }, step: (p) => ({ ...p, r: p.r + 1 }) },
    };

    const cfg = dirs[color] || dirs.red;
    const cells = [];
    let cur = { ...cfg.start };
    for (let i = 0; i < 5; i++) {
      cells.push({ ...cur });
      cur = cfg.step(cur);
    }
    return cells;
  }

  isSafeSpot(pos) {
    if (this.mode === 'hex') {
      const safe = this.pathGenerator.generateSafeZones();
      return safe.some((s) => s.q === pos.q && s.r === pos.r);
    }
    const safeSpots = [
      { r: 6, c: 1 }, { r: 2, c: 1 }, { r: 6, c: 8 }, { r: 8, c: 8 },
      { r: 13, c: 8 }, { r: 8, c: 13 }, { r: 1, c: 6 }, { r: 13, c: 6 },
      { r: 7, c: 0 }, { r: 0, c: 7 }, { r: 7, c: 14 }, { r: 14, c: 7 },
    ];
    return safeSpots.some((s) => s.r === pos.r && s.c === pos.c);
  }

  generateHomeColumn(color) {
    const dirs = {
      red:    { start: { r: 6, c: 1 }, step: (p) => ({ ...p, c: p.c + 1 }) },
      green:  { start: { r: 1, c: 6 }, step: (p) => ({ ...p, r: p.r + 1 }) },
      yellow: { start: { r: 8, c: 13 }, step: (p) => ({ ...p, c: p.c - 1 }) },
      blue:   { start: { r: 13, c: 8 }, step: (p) => ({ ...p, r: p.r - 1 }) },
      orange: { start: { r: 6, c: 1 }, step: (p) => ({ ...p, c: p.c + 1 }) },
      purple: { start: { r: 1, c: 6 }, step: (p) => ({ ...p, r: p.r + 1 }) },
    };

    const cfg = dirs[color] || dirs.red;
    const cells = [];
    let cur = { ...cfg.start };
    for (let i = 0; i < 5; i++) {
      cells.push({ ...cur });
      cur = cfg.step(cur);
    }
    return cells;
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
    return tokens.filter((token) => {
      if (token.status === 'finished') return false;
      if (token.status === 'yard' || token.status === 'home') return this.diceValue === 6;
      return this.pathIndexWithinBounds(token, this.diceValue);
    });
  }

  pathIndexWithinBounds(token, steps) {
    if (token.status === 'finished') return false;
    const path = this.paths[token.color];
    if (!path) return false;
    const homePath = this.homeColumns[token.color] || [];
    const currentIndex = token.pathIndex ?? 0;
    const trackLen = path.length;
    const totalLen = trackLen + homePath.length - 1;
    return currentIndex + steps <= totalLen;
  }

  moveToken(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (!token) return null;

    if (token.status === 'yard') {
      if (this.diceValue !== 6) return null;
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = (this.paths[token.color] || [])[0] || { r: 0, c: 0 };
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      this.finishTurn(player, false);
      return { token, r: token.r, c: token.c, captured: captured || false };
    }

    if (token.status === 'home') {
      if (this.diceValue !== 6) return null;
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = (this.paths[token.color] || [])[0] || { r: 0, c: 0 };
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      this.finishTurn(player, false);
      return { token, r: token.r, c: token.c, captured: captured || false };
    }

    if (token.status === 'onTrack') {
      const steps = this.diceValue;
      const path = this.paths[token.color] || [];
      const homePath = this.homeColumns[token.color] || [];
      const trackLen = path.length;
      const homeLen = homePath.length;
      const newIndex = (token.pathIndex ?? 0) + steps;

      if (newIndex >= trackLen) {
        const homeIndex = newIndex - trackLen;
        if (homeIndex < homeLen - 1) {
          token.status = 'homeColumn';
          token.homeColumnIndex = homeIndex;
          const pos = homePath[homeIndex] || { r: 0, c: 0 };
          token.r = pos.r;
          token.c = pos.c;
          const captured = this.checkCapture(player, token);
          const extraTurn = false;
          this.finishTurn(player, extraTurn);
          return { token, r: token.r, c: token.c, captured: captured || false, extraTurn };
        } else if (homeIndex === homeLen - 1) {
          token.status = 'finished';
          token.pathIndex = newIndex;
          const pos = homePath[homeIndex] || { r: 0, c: 0 };
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
        const pos = path[newIndex] || { r: 0, c: 0 };
        token.r = pos.r;
        token.c = pos.c;
        const captured = this.checkCapture(player, token);
        const extraTurn = captured !== false;
        this.finishTurn(player, extraTurn);
        return { token, r: token.r, c: token.c, captured: captured || false, extraTurn };
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
    }
    this.currentPlayer = (this.currentPlayer + 1) % this.sides;
    this.diceValue = null;
    this.turnPhase = 'roll';
  }

  isSafeSpot(pos) {
    const safeSpots = [
      { r: 6, c: 1 }, { r: 2, c: 1 }, { r: 6, c: 8 }, { r: 8, c: 8 },
      { r: 13, c: 8 }, { r: 8, c: 13 }, { r: 1, c: 6 }, { r: 13, c: 6 },
      { r: 7, c: 0 }, { r: 0, c: 7 }, { r: 7, c: 14 }, { r: 14, c: 7 },
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
      p.tokens = Array.from({ length: 4 }, (_, i) => ({
        id: `${p.color}-${i}`,
        color: p.color,
        status: 'yard',
        pathIndex: null,
        r: null,
        c: null,
        homeColumnIndex: null,
      }));
    });
    this.initPaths();
  }

  validate() {
    return this.players.every((p, i) => {
      if (this.winner) return true;
      const movable = this.getMovableTokens(p);
      if (movable.length === 0 && this.currentPlayer === i) return true;
      return true;
    });
  }
}

window.GameEngine = GameEngine;
