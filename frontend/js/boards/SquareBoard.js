class SquareBoard {
  constructor(size = 15) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
  }
  place(row, col, type) {
    this.grid[row][col] = type;
  }
  render() {
    return this.grid;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SquareBoard;
}
