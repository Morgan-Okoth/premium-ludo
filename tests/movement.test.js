const assert = {
  equal(actual, expected, msg) {
    if (actual !== expected) throw new Error(`${msg || 'assertion failed'}: expected ${expected}, got ${actual}`);
  },
  deepEqual(actual, expected, msg) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${msg || 'assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  },
  ok(val, msg) {
    if (!val) throw new Error(`${msg || 'assertion failed'}: value is falsy`);
  },
};

function runTests(name, fn) {
  let passed = 0;
  let failed = 0;
  console.log(`\n=== ${name} ===`);
  try {
    fn();
    console.log(`All passed (${passed})`);
  } catch (e) {
    failed = 1;
    console.log(`FAILED: ${e.message}`);
  }
  return { passed, failed };
}

function describe(name, fn) {
  fn();
}

function it(name, fn) {
  try {
    fn();
    assert.passed++;
  } catch (e) {
    assert.failed++;
    throw new Error(`FAIL ${name}: ${e.message}`);
  }
}

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
    const pg = new PathGenerator();
    for (const color of this.colors) {
      this.paths[color] = pg.getPath(color, this.mode);
      this.homeColumns[color] = pg.generateHomeLane(color);
    }
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

  checkCapture(player, token) {
    const pos = { r: token.r, c: token.c };
    const safe = this.pathGenerator.generateSafeZones();
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
}

class PathGenerator {
  constructor() {
    this.trackMap = {
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
        { r: 7, c: 1 },
      ],
      green: [
        { r: 1, c: 6 }, { r: 1, c: 7 },
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
        { r: 13, c: 8 }, { r: 13, c: 7 },
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
        { r: 8, c: 13 }, { r: 8, c: 12 },
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
  }

  getClassicPath(color) {
    return this.trackMap[color] || this.trackMap.red;
  }

  getHexPath(color) {
    const starts = {
      red: { q: -2, r: 2 },
      green: { q: 2, r: -2 },
      yellow: { q: 2, r: 0 },
      blue: { q: 0, r: 2 },
      orange: { q: -2, r: 0 },
      purple: { q: 0, r: -2 },
    };
    const start = starts[color] || starts.red;
    const ring = this._generateHexRing();
    const idx = ring.findIndex((p) => p.q === start.q && p.r === start.r);
    const out = [];
    for (let i = 0; i < ring.length; i++) out.push({ ...ring[(idx + i) % ring.length] });
    return out;
  }

  _generateHexRing() {
    const ring = [];
    const radius = 2;
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const isEdge =
          Math.abs(q) === radius ||
          Math.abs(r) === radius ||
          Math.abs(q + r) === radius;
        if (isEdge) ring.push({ q, r });
      }
    }
    return ring;
  }

  generateHomeLane(color) {
    if (color === 'red') return [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 }, { q: 0, r: 3 }, { q: 0, r: 4 }];
    if (color === 'green') return [{ q: 0, r: 0 }, { q: 1, r: -1 }, { q: 2, r: -2 }, { q: 3, r: -3 }, { q: 4, r: -4 }];
    if (color === 'yellow') return [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }, { q: 3, r: 0 }, { q: 4, r: 0 }];
    if (color === 'blue') return [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 }, { q: 0, r: 3 }, { q: 0, r: 4 }];
    if (color === 'orange') return [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 }, { q: 0, r: 3 }, { q: 0, r: 4 }];
    if (color === 'purple') return [{ q: 0, r: 0 }, { q: 1, r: -1 }, { q: 2, r: -2 }, { q: 3, r: -3 }, { q: 4, r: -4 }];
    return [];
  }

  generateStartCells(color) {
    const starts = {
      red: { q: -2, r: 2 },
      green: { q: 2, r: -2 },
      yellow: { q: 2, r: 0 },
      blue: { q: 0, r: 2 },
      orange: { q: -2, r: 0 },
      purple: { q: 0, r: -2 },
    };
    return starts[color] || starts.red;
  }

  generateSafeZones() {
    return [
      { q: -2, r: 2 },
      { q: 2, r: -2 },
      { q: 2, r: 0 },
      { q: 0, r: 2 },
      { q: -2, r: 0 },
      { q: 0, r: -2 },
      { q: 0, r: 0 },
    ];
  }

  getPath(color, mode = 'classic') {
    if (mode === 'hex') return this.getHexPath(color);
    return this.getClassicPath(color);
  }
}

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

    const remainingToHome = path.length - token.pathIndex;
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

class MovementTests {
  run() {
    const results = [];
    const add = (name, fn) => {
      try {
        fn();
        results.push({ name, pass: true });
      } catch (e) {
        results.push({ name, pass: false, error: e.message });
      }
    };

    add('classic red path length', () => {
      const pg = new PathGenerator();
      const path = pg.getPath('red');
      assert.equal(path.length, 52, 'red classic path length');
    });

    add('classic green home lane connects last path cell', () => {
      const pg = new PathGenerator();
      const path = pg.getPath('green');
      const home = pg.generateHomeLane('green');
      const connectCell = home[0];
      const lastPathCell = path[path.length - 1];
      assert.ok(Math.abs(lastPathCell.r - connectCell.r) <= 1 && Math.abs(lastPathCell.c - connectCell.c) <= 1, 'home lane entry should be adjacent');
    });

    add('classic exact finish required', () => {
      const engine = new GameEngine(4, null, 'classic');
      const player = engine.players[0];
      const tokenIndex = 0;
      player.tokens[tokenIndex].status = 'onTrack';
      player.tokens[tokenIndex].pathIndex = engine.paths['red'].length + engine.homeColumns['red'].length - 2;
      const exact = engine.pathIndexWithinBounds(player.tokens[tokenIndex], 1);
      const overshoot = engine.pathIndexWithinBounds(player.tokens[tokenIndex], 2);
      assert.ok(exact, 'exact finish should be valid');
      assert.ok(!overshoot, 'overshoot should be invalid');
    });

    add('classic cannot move finished token', () => {
      const engine = new GameEngine(4, null, 'classic');
      const player = engine.players[0];
      player.tokens[0].status = 'finished';
      assert.equal(engine.getMovableTokens(player).length, 0);
    });

    add('classic 6 allows yard exit', () => {
      const engine = new GameEngine(4, null, 'classic');
      engine.diceValue = 6;
      const player = engine.players[0];
      const movable = engine.getMovableTokens(player);
      assert.ok(movable.length > 0);
    });

    add('classic non-6 blocks yard', () => {
      const engine = new GameEngine(4, null, 'classic');
      engine.diceValue = 3;
      const player = engine.players[0];
      const movable = engine.getMovableTokens(player);
      assert.equal(movable.length, 0);
    });

    add('movement engine canEnterHomeLane true when adjacent', () => {
      const engine = new GameEngine(4, null, 'classic');
      const me = new MovementEngine(engine);
      const token = engine.players[0].tokens[0];
      token.status = 'onTrack';
      token.pathIndex = engine.paths['red'].length - 1;
      assert.ok(me.canEnterHomeLane(engine.players[0], 0));
    });

    add('movement engine canEnterHomeLane false when far', () => {
      const engine = new GameEngine(4, null, 'classic');
      const me = new MovementEngine(engine);
      const token = engine.players[0].tokens[0];
      token.status = 'onTrack';
      token.pathIndex = 0;
      assert.ok(!me.canEnterHomeLane(engine.players[0], 0));
    });

    add('movement engine isOvershootMove true', () => {
      const engine = new GameEngine(4, null, 'classic');
      const me = new MovementEngine(engine);
      const token = engine.players[0].tokens[0];
      token.status = 'onTrack';
      token.pathIndex = engine.paths['red'].length + engine.homeColumns['red'].length - 2;
      assert.ok(me.isOvershootMove(engine.players[0], 0, 5));
    });

    add('movement engine isOvershootMove false', () => {
      const engine = new GameEngine(4, null, 'classic');
      const me = new MovementEngine(engine);
      const token = engine.players[0].tokens[0];
      token.status = 'onTrack';
      token.pathIndex = 0;
      assert.ok(!me.isOvershootMove(engine.players[0], 0, 1));
    });

    add('movement engine animateMove handles missing token', () => {
      const engine = new GameEngine(4, null, 'classic');
      const me = new MovementEngine(engine);
      const token = engine.players[0].tokens[0];
      token.r = null;
      token.c = null;
      me.animateMove(engine.players[0], 0, () => {});
    });

    return results;
  }
}

const mTests = new MovementTests();
const results = mTests.run();
const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass).length;
console.log(`\nRESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  results.filter((r) => !r.pass).forEach((r) => console.log(`- ${r.name}: ${r.error}`));
  process.exit(1);
}
