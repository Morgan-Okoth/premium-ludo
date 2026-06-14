#!/usr/bin/env node
const assert = require('assert');

function assertEqual(act, exp, msg) {
  assert.strictEqual(act, exp, msg);
}
function assertOk(val, msg) {
  assert.ok(val, msg);
}

class PathGenerator {
  constructor() {
    this.classicTracks = {
      red: [
        {r:6,c:0},{r:6,c:1},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:1,c:1},
        {r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5},{r:1,c:6},{r:0,c:6},{r:0,c:7},
        {r:0,c:8},{r:1,c:8},{r:2,c:8},{r:3,c:8},{r:4,c:8},{r:5,c:8},{r:6,c:8},
        {r:6,c:9},{r:6,c:10},{r:6,c:11},{r:6,c:12},{r:6,c:13},{r:7,c:13},{r:8,c:13},
        {r:8,c:12},{r:8,c:11},{r:8,c:10},{r:8,c:9},{r:8,c:8},{r:9,c:8},{r:10,c:8},
        {r:11,c:8},{r:12,c:8},{r:13,c:8},{r:13,c:7},{r:14,c:7},{r:14,c:6},{r:13,c:6},
        {r:12,c:6},{r:11,c:6},{r:10,c:6},{r:9,c:6},{r:8,c:6},{r:8,c:5},{r:8,c:4},
        {r:8,c:3},{r:8,c:2},{r:8,c:1},{r:7,c:1}
      ],
      green: [
        {r:1,c:6},{r:1,c:7},{r:2,c:7},{r:3,c:7},{r:4,c:7},{r:5,c:7},{r:6,c:7},
        {r:6,c:8},{r:6,c:9},{r:6,c:10},{r:6,c:11},{r:6,c:12},{r:7,c:12},{r:7,c:13},
        {r:8,c:13},{r:9,c:13},{r:10,c:13},{r:11,c:13},{r:12,c:13},{r:13,c:13},{r:13,c:12},
        {r:13,c:11},{r:13,c:10},{r:13,c:9},{r:13,c:8},{r:14,c:8},{r:14,c:7},{r:14,c:6},
        {r:13,c:6},{r:12,c:6},{r:11,c:6},{r:10,c:6},{r:9,c:6},{r:8,c:6},{r:8,c:5},
        {r:8,c:4},{r:8,c:3},{r:8,c:2},{r:8,c:1},{r:7,c:1},{r:6,c:1},{r:6,c:0},
        {r:5,c:0},{r:4,c:0},{r:3,c:0},{r:2,c:0},{r:1,c:0},{r:1,c:1},{r:1,c:2},
        {r:1,c:3},{r:1,c:4},{r:1,c:5}
      ],
      yellow: [
        {r:13,c:8},{r:13,c:7},{r:12,c:7},{r:11,c:7},{r:10,c:7},{r:9,c:7},{r:8,c:7},
        {r:8,c:6},{r:8,c:5},{r:8,c:4},{r:8,c:3},{r:8,c:2},{r:7,c:2},{r:7,c:1},
        {r:6,c:1},{r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},{r:1,c:1},{r:1,c:2},
        {r:1,c:3},{r:1,c:4},{r:1,c:5},{r:1,c:6},{r:0,c:6},{r:0,c:7},{r:0,c:8},
        {r:1,c:8},{r:2,c:8},{r:3,c:8},{r:4,c:8},{r:5,c:8},{r:6,c:8},{r:6,c:9},
        {r:6,c:10},{r:6,c:11},{r:6,c:12},{r:6,c:13},{r:7,c:13},{r:8,c:13},{r:9,c:13},
        {r:10,c:13},{r:11,c:13},{r:12,c:13},{r:13,c:13},{r:13,c:12},{r:13,c:11},
        {r:13,c:10},{r:13,c:9}
      ],
      blue: [
        {r:8,c:13},{r:8,c:12},{r:9,c:12},{r:10,c:12},{r:11,c:12},{r:12,c:12},{r:13,c:12},
        {r:13,c:11},{r:13,c:10},{r:13,c:9},{r:13,c:8},{r:13,c:7},{r:13,c:6},{r:14,c:6},
        {r:14,c:6},{r:13,c:6},{r:12,c:6},{r:11,c:6},{r:10,c:6},{r:9,c:6},{r:8,c:6},
        {r:8,c:5},{r:8,c:4},{r:8,c:3},{r:8,c:2},{r:8,c:1},{r:7,c:1},{r:6,c:1},
        {r:6,c:0},{r:5,c:0},{r:4,c:0},{r:3,c:0},{r:2,c:0},{r:1,c:0},{r:1,c:1},
        {r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5},{r:0,c:5},{r:0,c:6},{r:0,c:7},
        {r:1,c:7},{r:2,c:7},{r:3,c:7},{r:4,c:7},{r:5,c:7},{r:6,c:7},{r:6,c:8},
        {r:6,c:9},{r:6,c:10},{r:6,c:11},{r:6,c:12}
      ],
    };

    this.hexTracks = {
      red: this.generateHexRingTrack({q:-2,r:2}),
      green: this.generateHexRingTrack({q:2,r:-2}),
      yellow: this.generateHexRingTrack({q:2,r:0}),
      blue: this.generateHexRingTrack({q:0,r:2}),
      orange: this.generateHexRingTrack({q:-2,r:0}),
      purple: this.generateHexRingTrack({q:0,r:-2})
    };

    this.hexHomeLanes = {
      red: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      green: [{q:0,r:0},{q:1,r:-1},{q:2,r:-2},{q:3,r:-3},{q:4,r:-4}],
      yellow: [{q:0,r:0},{q:1,r:0},{q:2,r:0},{q:3,r:0},{q:4,r:0}],
      blue: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      orange: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      purple: [{q:0,r:0},{q:1,r:-1},{q:2,r:-2},{q:3,r:-3},{q:4,r:-4}]
    };

    this.classicHomeLanes = {
      red: this.generateClassicHome('red'),
      green: this.generateClassicHome('green'),
      yellow: this.generateClassicHome('yellow'),
      blue: this.generateClassicHome('blue'),
      orange: this.generateClassicHome('red'),
      purple: this.generateClassicHome('green')
    };

    this.safeCells = {
      classic: [
        {r:6,c:1},{r:2,c:1},{r:6,c:8},{r:8,c:8},{r:13,c:8},{r:8,c:13},
        {r:1,c:6},{r:13,c:6},{r:7,c:0},{r:0,c:7},{r:7,c:14},{r:14,c:7}
      ],
      hex: [
        {q:-2,r:2},{q:2,r:-2},{q:2,r:0},{q:0,r:2},{q:-2,r:0},{q:0,r:-2},{q:0,r:0}
      ]
    };

    this.starts = {
      red: {q:-2,r:2},
      green: {q:2,r:-2},
      yellow: {q:2,r:0},
      blue: {q:0,r:2},
      orange: {q:-2,r:0},
      purple: {q:0,r:-2}
    };
  }

  generateClassicHome(color) {
    const starts = {
      red: {r:6,c:1}, green: {r:1,c:6}, yellow: {r:8,c:13},
      blue: {r:13,c:8}, orange: {r:6,c:1}, purple: {r:1,c:6}
    };
    const steps = {
      red: (p) => ({r:p.r, c:p.c+1}), green: (p) => ({r:p.r+1, c:p.c}),
      yellow: (p) => ({r:p.r, c:p.c-1}), blue: (p) => ({r:p.r-1, c:p.c}),
      orange: (p) => ({r:p.r, c:p.c+1}), purple: (p) => ({r:p.r+1, c:p.c})
    };
    const start = starts[color] || starts.red;
    const step = steps[color] || steps.red;
    const lane = [];
    let cur = {...start};
    for (let i = 0; i < 5; i++) { lane.push({...cur}); cur = step(cur); }
    return lane;
  }

  generateHexRingTrack(startCell) {
    const ring = [];
    const radius = 2;
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const isEdge = Math.abs(q) === radius || Math.abs(r) === radius || Math.abs(q+r) === radius;
        if (isEdge) ring.push({q, r});
      }
    }
    const idx = ring.findIndex((p) => p.q === startCell.q && p.r === startCell.r);
    const out = [];
    for (let i = 0; i < ring.length; i++) out.push({...ring[(idx+i)%ring.length]});
    return out;
  }

  getPath(color, mode='classic') {
    if (mode === 'hex') return this.hexTracks[color] || this.classicTracks.red;
    return this.classicTracks[color] || this.classicTracks.red;
  }

  getHomeLane(color, mode='classic') {
    if (mode === 'hex') return this.hexHomeLanes[color] || this.hexHomeLanes.red;
    return this.classicHomeLanes[color] || this.classicHomeLanes.red;
  }

  getSafeCells(mode='classic') {
    return this.safeCells[mode] || this.safeCells.classic;
  }

  getStartCell(color) {
    return this.starts[color] || this.starts.red;
  }
}

class GameEngine {
  constructor(playerCount = 4, names = null, mode = 'classic') {
    this.sides = playerCount;
    this.mode = mode;
    this.colors = mode === 'hex'
      ? ['red','orange','yellow','green','blue','purple']
      : ['red','green','yellow','blue'];
    this.players = names
      ? names.map((name, i) => ({name, color: this.colors[i], ai: false}))
      : this.colors.map((color, i) => ({name: color, color, ai: false}));
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
    return this.pathGenerator.getPath(color, this.mode);
  }

  generateHomeColumn(color) {
    return this.pathGenerator.getHomeLane(color, this.mode);
  }

  isSafeSpot(pos) {
    if (!pos) return false;
    const safe = this.pathGenerator.getSafeCells(this.mode);
    if (this.mode === 'hex') return safe.some((s) => s.q === pos.q && s.r === pos.r);
    return safe.some((s) => s.r === pos.r && s.c === pos.c);
  }

  rollDie() {
    if (this.diceValue !== null) return this.diceValue;
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.consecutiveSixes = this.diceValue === 6 ? this.consecutiveSixes + 1 : 0;
    this.turnPhase = 'move';
    return this.diceValue;
  }

  getMovableTokens(player) {
    return (player.tokens || []).filter((token) => {
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
    return currentIndex + steps <= (path.length + homePath.length - 1);
  }

  moveToken(player, tokenIndex) {
    const token = player.tokens[tokenIndex];
    if (!token) return null;
    if (token.status === 'yard') {
      if (this.diceValue !== 6) return null;
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = this.paths[token.color][0] || {r:0,c:0};
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      this.finishTurn(player, false);
      return {token, captured: !!captured};
    }
    if (token.status === 'home') {
      if (this.diceValue !== 6) return null;
      token.status = 'onTrack';
      token.pathIndex = 0;
      const pos = this.paths[token.color][0] || {r:0,c:0};
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      this.finishTurn(player, false);
      return {token, captured: !!captured};
    }
    if (token.status === 'onTrack') {
      const steps = this.diceValue;
      const path = this.paths[token.color] || [];
      const homePath = this.homeColumns[token.color] || [];
      const newIndex = (token.pathIndex ?? 0) + steps;
      if (newIndex >= path.length) {
        const homeIndex = newIndex - path.length;
        if (homeIndex >= homePath.length) return null;
        token.status = homeIndex === homePath.length - 1 ? 'finished' : 'homeColumn';
        token.pathIndex = newIndex;
        token.homeColumnIndex = homeIndex;
        const pos = homePath[homeIndex] || {r:0,c:0};
        if (this.mode === 'hex' && pos.q !== undefined && pos.r !== undefined) {
          token.r = pos.q;
          token.c = pos.r;
        } else {
          token.r = pos.r;
          token.c = pos.c;
        }
        const captured = this.checkCapture(player, token);
        const extra = token.status === 'finished' ? this.checkWinCondition(player) : false;
        this.finishTurn(player, extra);
        return {token, captured: !!captured, finished: token.status === 'finished', extraTurn: !!extra};
      }
      token.pathIndex = newIndex;
      const pos = path[newIndex] || {r:0,c:0};
      token.r = pos.r;
      token.c = pos.c;
      const captured = this.checkCapture(player, token);
      const extra = !!captured;
      this.finishTurn(player, extra);
      return {token, captured: !!captured, extraTurn: extra};
    }
    return null;
  }

  checkCapture(player, token) {
    const pos = {r: token.r, c: token.c};
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
    if (allFinished) { this.winner = player.color; return true; }
    return false;
  }

  finishTurn(player, extraTurn) {
    if (extraTurn) {
      this.diceValue = null;
      this.turnPhase = 'roll';
      return;
    }
    if (this.consecutiveSixes >= this.maxConsecutiveSixes) this.consecutiveSixes = 0;
    this.currentPlayer = (this.currentPlayer + 1) % this.sides;
    this.diceValue = null;
    this.turnPhase = 'roll';
  }

  getState() {
    return {
      players: this.players.map((p) => ({...p})),
      currentPlayer: this.currentPlayer,
      diceValue: this.diceValue,
      turnPhase: this.turnPhase,
      winner: this.winner,
      captures: {...this.captures},
    };
  }
}

function createEngine(playerCount, mode) {
  const colors = mode === 'hex'
    ? ['red','green','yellow','blue','orange','purple']
    : ['red','green','yellow','blue'];
  const engine = new GameEngine(playerCount, colors.slice(0,playerCount), mode);
  engine.players.forEach((p) => {
    p.tokens = Array.from({length:4},(_,i)=> ({
      id:`${p.color}-${i}`, color:p.color, status:'yard', pathIndex:null, r:null, c:null, homeColumnIndex:null, isBot:true
    }));
  });
  return engine;
}

function simulate(playerCount, mode) {
  const engine = createEngine(playerCount, mode);
  let turns = 0;
  const maxTurns = 4000;
  while (!engine.winner && turns < maxTurns) {
    const player = engine.players[engine.currentPlayer];
    if (!player.isBot) { engine.finishTurn(player, false); continue; }
    engine.diceValue = null;
    engine.rollDie();
    const choice = Math.min(
      (player.tokens || []).findIndex((t) => {
        if (t.status === 'finished') return false;
        if (t.status === 'yard') return engine.diceValue === 6;
        if (t.status === 'onTrack') {
          const path = engine.paths[t.color];
          const home = engine.homeColumns[t.color] || [];
          return (t.pathIndex ?? 0) + engine.diceValue <= (path.length + home.length - 1);
        }
        return false;
      }),
      player.tokens.length - 1
    );
    if (choice >= 0 && player.tokens[choice]) engine.moveToken(player, choice);
    else engine.finishTurn(player, false);
    turns++;
  }
  return {winner: engine.winner, turns, crashed: turns >= maxTurns, captures: {...engine.captures}};
}

function assertPathCompleteness() {
  const pg = new PathGenerator();
  ['red','green','yellow','blue','orange','purple'].forEach((c) => {
    const classic = pg.getPath(c, 'classic');
    assertOk(classic.length >= 50, `${c} classic path too short`);
    assertOk(pg.getHomeLane(c, 'classic').length === 5, `${c} classic home lane wrong`);
    const hex = pg.getPath(c, 'hex');
    assertOk(hex.length >= 1, `${c} hex path missing`);
    assertOk(pg.getHomeLane(c, 'hex').length === 5, `${c} hex home lane wrong`);
  });
}

function run() {
  const results = [];
  assertPathCompleteness();
  const configs = [
    {players:2, mode:'classic'},
    {players:3, mode:'classic'},
    {players:4, mode:'classic'},
    {players:5, mode:'hex'},
    {players:6, mode:'hex'},
  ];
  configs.forEach((cfg) => {
    for (let i = 0; i < 25; i++) {
      try {
        results.push({...simulate(cfg.players, cfg.mode), players:cfg.players, mode:cfg.mode});
      } catch (e) {
        results.push({error: e.message, players:cfg.players, mode:cfg.mode});
      }
    }
  });
  const summary = {
    total: results.length,
    successes: results.filter((r)=>!r.error).length,
    failures: results.filter((r)=>r.error).length,
    crashes: results.filter((r)=>r.crashed).length,
    byMode: {},
  };
  results.forEach((r) => {
    if (r.error) return;
    const key = `${r.players}-${r.mode}`;
    if (!summary.byMode[key]) summary.byMode[key] = {wins:{}};
    if (r.winner) summary.byMode[key].wins[r.winner] = (summary.byMode[key].wins[r.winner]||0)+1;
  });
  console.log(JSON.stringify(summary, null, 2));
}

run();
