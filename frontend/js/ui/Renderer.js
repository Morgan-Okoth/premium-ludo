class Renderer {
  constructor(container, boardSize = 15) {
    this.container = container;
    this.boardSize = boardSize;
  }

  buildBoard(grid = []) {
    this.container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board';
    board.style.setProperty('--size', String(this.boardSize));
    if (grid.length === 0) {
      for (let i = 0; i < this.boardSize * this.boardSize; i++) board.appendChild(document.createElement('div'));
    } else {
      grid.forEach((cell) => {
        const el = document.createElement('div');
        const parts = [];
        if (typeof cell === 'string') parts.push(cell);
        else if (cell && cell.type) parts.push(cell.type);
        el.className = `cell ${parts.join(' ')}`.trim();
        board.appendChild(el);
      });
    }
    this.container.appendChild(board);
    return board;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Renderer;
}
