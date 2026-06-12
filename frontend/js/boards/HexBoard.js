class HexBoard {
  constructor(size = 9) {
    this.size = size;
    this.cells = {};
  }

  axialToPixel(q, r) {
    const x = this.size * (3/2 * q);
    const y = this.size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
  }

  render() {
    const maxRadius = this.size;
    const cells = [];
    for (let q = -maxRadius; q <= maxRadius; q++) {
      const r1 = Math.max(-maxRadius, -q - maxRadius);
      const r2 = Math.min(maxRadius, -q + maxRadius);
      for (let r = r1; r <= r2; r++) {
        cells.push({ q, r, ...this.axialToPixel(q, r) });
      }
    }
    return cells;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexBoard;
}
