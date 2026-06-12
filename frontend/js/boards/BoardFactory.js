class BoardFactory {
  static create(type) {
    if (type === 'hex') return new HexBoard(9);
    return new SquareBoard(15);
  }
}

class SquareBoard {
  constructor(size = 15) {
    this.size = size;
  }
  render(container) {
    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board classic';
    board.style.setProperty('--size', String(this.size));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        board.appendChild(cell);
      }
    }
    container.appendChild(board);
    return board;
  }
}

class HexBoard {
  constructor(size = 9) {
    this.size = size;
  }
  render(container) {
    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board hex';
    const side = Math.max(7, this.size * 2 - 1);
    board.style.setProperty('--size', String(side));
    const center = Math.floor(side / 2);
    for (let r = 0; r < side; r++) {
      for (let c = 0; c < side; c++) {
        const dx = Math.abs(c - center);
        const dy = Math.abs(r - center);
        if (dx + dy > center) continue;
        const cell = document.createElement('div');
        cell.className = 'cell hex-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        const dist = Math.max(dx, dy);
        if (dist === center) {
          const colors = ['hex-red','hex-orange','hex-yellow','hex-green','hex-blue','hex-purple'];
          const idx = Math.floor(((Math.atan2(r - center, c - center) * 180 / Math.PI) + 360) % 360 / 60);
          cell.classList.add(colors[idx]);
        }
        board.appendChild(cell);
      }
    }
    container.appendChild(board);
    return board;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BoardFactory, SquareBoard, HexBoard };
}
