class HexBoard {
  constructor(size = 9, debug = false) {
    this.size = size;
    this.debug = debug;
    this.cells = {};
  }

  axialToPixel(q, r) {
    const x = this.size * (3 / 2 * q);
    const y = this.size * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
    return { x, y };
  }

  pixelToAxial(x, y) {
    const q = (2 / 3 * x) / this.size;
    const r = (-1 / 3 * x + Math.sqrt(3) / 3 * y) / this.size;
    return this.axialRound(q, r);
  }

  axialRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  render() {
    const maxRadius = this.size;
    const cells = [];
    const centers = [];

    for (let q = -maxRadius; q <= maxRadius; q++) {
      const r1 = Math.max(-maxRadius, -q - maxRadius);
      const r2 = Math.min(maxRadius, -q + maxRadius);
      for (let r = r1; r <= r2; r++) {
        const pos = this.axialToPixel(q, r);
        cells.push({ q, r, x: pos.x, y: pos.y });
      }
    }

    if (this.debug) {
      const center = this.axialToPixel(0, 0);
      centers.push({ q: 0, r: 0, x: center.x, y: center.y, label: 'CENTER' });
    }

    return {
      cells,
      centers,
      size: this.size,
    };
  }

  renderWithDebug(overlayCallbacks) {
    const result = this.render();
    if (!this.debug) return result;

    if (overlayCallbacks && overlayCallbacks.onCells) {
      overlayCallbacks.onCells(result.cells);
    }
    if (overlayCallbacks && overlayCallbacks.onCenter) {
      overlayCallbacks.onCenter(result.centers[0]);
    }

    return result;
  }

  toggleDebug() {
    this.debug = !this.debug;
    return this.debug;
  }

  isDebugEnabled() {
    return this.debug;
  }

  getCellAt(q, r) {
    return result.cells.find((c) => c.q === q && c.r === r);
  }

  distance(a, b) {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
  }

  getNeighbors(q, r) {
    const directions = [
      { q: 1, r: 0 },
      { q: 1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: 0, r: 1 },
    ];

    return directions
      .map((d) => ({ q: q + d.q, r: r + d.r }))
      .filter((n) => this.isValidCell(n.q, n.r));
  }

  isValidCell(q, r) {
    const maxRadius = this.size;
    return (
      Math.abs(q) <= maxRadius &&
      Math.abs(r) <= maxRadius &&
      Math.abs(q + r) <= maxRadius
    );
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexBoard;
  module.exports.default = HexBoard;
}
