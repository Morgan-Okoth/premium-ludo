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
      orange: [
        {r:5,c:0},{r:5,c:1},{r:5,c:2},{r:5,c:3},{r:5,c:4},{r:5,c:5},{r:4,c:6},
        {r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},{r:0,c:7},{r:0,c:8},{r:1,c:8},
        {r:2,c:8},{r:3,c:8},{r:4,c:8},{r:5,c:8},{r:6,c:8},{r:7,c:8},{r:8,c:8},
        {r:9,c:8},{r:10,c:8},{r:11,c:8},{r:12,c:8},{r:13,c:8},{r:13,c:7},{r:14,c:7},
        {r:14,c:6},{r:13,c:6},{r:12,c:6},{r:11,c:6},{r:10,c:6},{r:9,c:6},{r:8,c:6},
        {r:7,c:6},{r:6,c:6},{r:6,c:5},{r:6,c:4},{r:6,c:3},{r:6,c:2},{r:6,c:1},
        {r:6,c:0},{r:5,c:0}
      ],
      purple: [
        {r:9,c:0},{r:9,c:1},{r:9,c:2},{r:9,c:3},{r:9,c:4},{r:9,c:5},{r:8,c:6},
        {r:7,c:6},{r:6,c:6},{r:6,c:7},{r:6,c:8},{r:6,c:9},{r:6,c:10},{r:6,c:11},
        {r:6,c:12},{r:7,c:12},{r:8,c:12},{r:9,c:12},{r:10,c:12},{r:11,c:12},{r:12,c:12},
        {r:13,c:12},{r:13,c:11},{r:13,c:10},{r:13,c:9},{r:13,c:8},{r:13,c:7},{r:13,c:6},
        {r:14,c:6},{r:14,c:5},{r:13,c:5},{r:12,c:5},{r:11,c:5},{r:10,c:5},{r:9,c:5},
        {r:8,c:5},{r:8,c:4},{r:8,c:3},{r:8,c:2},{r:8,c:1},{r:8,c:0},{r:9,c:0}
      ]
    };

    this.hexTracks = {
      red: this.generateHexRingTrack({q:-2,r:2}),
      green: this.generateHexRingTrack({q:2,r:-2}),
      yellow: this.generateHexRingTrack({q:2,r:0}),
      blue: this.generateHexRingTrack({q:0,r:2}),
      orange: this.generateHexRingTrack({q:-2,r:0}),
      purple: this.generateHexRingTrack({q:0,r:-2})
    };

    this.homeLanes = {
      red: this.generateClassicHomeLane('red'),
      green: this.generateClassicHomeLane('green'),
      yellow: this.generateClassicHomeLane('yellow'),
      blue: this.generateClassicHomeLane('blue')
    };

    this.hexHomeLanes = {
      red: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      green: [{q:0,r:0},{q:1,r:-1},{q:2,r:-2},{q:3,r:-3},{q:4,r:-4}],
      yellow: [{q:0,r:0},{q:1,r:0},{q:2,r:0},{q:3,r:0},{q:4,r:0}],
      blue: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      orange: [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:0,r:3},{q:0,r:4}],
      purple: [{q:0,r:0},{q:1,r:-1},{q:2,r:-2},{q:3,r:-3},{q:4,r:-4}]
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

    this.startCells = {
      red: {q:-2,r:2},
      green: {q:2,r:-2},
      yellow: {q:2,r:0},
      blue: {q:0,r:2},
      orange: {q:-2,r:0},
      purple: {q:0,r:-2}
    };
  }

  generateClassicHomeLane(color) {
    const configs = {
      red: { start: {r:6,c:1}, step: p => ({...p, c: p.c + 1}) },
      green: { start: {r:1,c:6}, step: p => ({...p, r: p.r + 1}) },
      yellow: { start: {r:8,c:13}, step: p => ({...p, c: p.c - 1}) },
      blue: { start: {r:13,c:8}, step: p => ({...p, r: p.r - 1}) },
      orange: { start: {r:6,c:1}, step: p => ({...p, c: p.c + 1}) },
      purple: { start: {r:1,c:6}, step: p => ({...p, r: p.r + 1}) }
    };
    const cfg = configs[color] || configs.red;
    const lane = [];
    let cur = {...cfg.start};
    for (let i = 0; i < 5; i++) {
      lane.push({...cur});
      cur = cfg.step(cur);
    }
    return lane;
  }

  generateHexRingTrack(startCell) {
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
        if (isEdge) ring.push({q, r});
      }
    }
    const idx = ring.findIndex(p => p.q === startCell.q && p.r === startCell.r);
    const out = [];
    for (let i = 0; i < ring.length; i++) {
      out.push({...ring[(idx + i) % ring.length]});
    }
    return out;
  }

  getPath(color, mode = 'classic') {
    if (mode === 'hex') return this.hexTracks[color] || this.classicTracks.red;
    return this.classicTracks[color] || this.classicTracks.red;
  }

  getHomeLane(color, mode = 'classic') {
    if (mode === 'hex') return this.hexHomeLanes[color] || this.hexHomeLanes.red;
    return this.homeLanes[color] || this.homeLanes.red;
  }

  getSafeCells(mode = 'classic') {
    return this.safeCells[mode] || this.safeCells.classic;
  }

  getStartCell(color) {
    return this.startCells[color] || this.startCells.red;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathGenerator;
}
