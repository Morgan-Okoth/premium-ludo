class BoardFactory {
  static create(type) {
    if (type === 'hex') return new HexBoard();
    return new ClassicBoard();
  }
}

class ClassicBoard {
  constructor() {
    this.size = 15;
    this.home = {
      red:    { rows: [0,1,2,3,4,5], cols: [0,1,2,3,4,5] },
      green:  { rows: [0,1,2,3,4,5], cols: [9,10,11,12,13,14] },
      yellow: { rows: [9,10,11,12,13,14], cols: [0,1,2,3,4,5] },
      blue:   { rows: [9,10,11,12,13,14], cols: [9,10,11,12,13,14] },
    };
  }

  render() {
    const cells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const color = this.colorFor(r, c);
        const pc = this.pathCell(r, c);
        cells.push({ r, c, color, path: pc });
      }
    }
    return { size: this.size, cells, type: 'classic' };
  }

  colorFor(r, c) {
    for (const [color, zone] of Object.entries(this.home)) {
      if (zone.rows.includes(r) && zone.cols.includes(c)) return color;
    }
    return null;
  }

  pathCell(r, c) {
    const mainTrack = [
      [6,0],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
      [0,6],[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[6,9],[6,10],[6,11],[6,12],[6,13],[7,13],[8,13],
      [8,12],[8,11],[8,10],[8,9],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[13,7],[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,6],
      [8,5],[8,4],[8,3],[8,2],[8,1],[7,1]
    ];
    const m = mainTrack.findIndex(p => p[0] === r && p[1] === c);
    if (m >= 0) return { side: 'red', index: m };
    const homes = {
      red: [[6,1],[5,1],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6]],
      green: [[1,6],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[6,8],[6,9],[6,10],[6,11],[6,12]],
      yellow: [[13,7],[13,6],[12,6],[11,6],[10,6],[9,6],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1]],
      blue: [[8,13],[8,12],[8,11],[8,10],[8,9],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[13,7]]
    };
    for (const [side, pts] of Object.entries(homes)) {
      const h = pts.findIndex(p => p[0] === r && p[1] === c);
      if (h >= 0) return { side, index: h, home: true };
    }
    return null;
  }
}

class HexBoard {
  constructor() {
    this.size = 11;
    this.colors = ['red','orange','yellow','green','blue','purple'];
  }

  render() {
    const c = Math.floor(this.size / 2);
    const cells = [];
    for (let r = 0; r < this.size; r++) {
      for (let col = 0; col < this.size; col++) {
        const dx = Math.abs(col - c);
        const dy = Math.abs(r - c);
        if (dx + dy > c) continue;
        const dist = Math.max(dx, dy);
        let color = null;
        if (dist === c) {
          const a = Math.atan2(r - c, col - c);
          const deg = ((a * 180 / Math.PI) + 360) % 360;
          color = this.colors[Math.floor(deg / 60) % this.colors.length];
        }
        cells.push({ r, c: col, color, dist });
      }
    }
    return { size: this.size, cells, type: 'hex' };
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = { BoardFactory, ClassicBoard, HexBoard };
