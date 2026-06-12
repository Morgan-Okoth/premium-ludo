class BoardManager {
  constructor() {
    this.paths = {
      red: [
        [6, 0],
        [6, 1],
        [5, 1],
        [4, 1],
        [3, 1],
        [2, 1],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
        [0, 6],
        [0, 7],
        [0, 8],
        [1, 8],
        [2, 8],
        [3, 8],
        [4, 8],
        [5, 8],
        [6, 8],
        [6, 9],
        [6, 10],
        [6, 11],
        [6, 12],
        [6, 13],
        [7, 13],
        [8, 13],
        [8, 12],
        [8, 11],
        [8, 10],
        [8, 9],
        [8, 8],
        [9, 8],
        [10, 8],
        [11, 8],
        [12, 8],
        [13, 8],
        [13, 7],
        [14, 7],
        [14, 6],
        [13, 6],
        [12, 6],
        [11, 6],
        [10, 6],
        [9, 6],
        [8, 6],
        [8, 5],
        [8, 4],
        [8, 3],
        [8, 2],
        [8, 1],
        [7, 1],
      ],
    };

    this.stretch = {
      red: [
        [6, 1],
        [5, 1],
        [4, 1],
        [3, 1],
        [2, 1],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
      ],
      green: [
        [1, 6],
        [1, 7],
        [2, 7],
        [3, 7],
        [4, 7],
        [5, 7],
        [6, 7],
        [6, 8],
        [6, 9],
        [6, 10],
        [6, 11],
        [6, 12],
      ],
      yellow: [
        [8, 13],
        [8, 12],
        [8, 11],
        [8, 10],
        [8, 9],
        [8, 8],
        [9, 8],
        [10, 8],
        [11, 8],
        [12, 8],
        [13, 8],
        [13, 7],
      ],
      blue: [
        [13, 6],
        [12, 6],
        [11, 6],
        [10, 6],
        [9, 6],
        [8, 6],
        [8, 5],
        [8, 4],
        [8, 3],
        [8, 2],
        [8, 1],
      ],
    };

    this.home = {
      red: [
        [6, 1],
        [5, 1],
        [4, 1],
        [3, 1],
        [2, 1],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
      ],
      green: [
        [1, 6],
        [1, 7],
        [2, 7],
        [3, 7],
        [4, 7],
        [5, 7],
        [6, 7],
        [6, 8],
        [6, 9],
        [6, 10],
        [6, 11],
        [6, 12],
      ],
      yellow: [
        [13, 8],
        [13, 7],
        [13, 6],
        [12, 6],
        [11, 6],
        [10, 6],
        [9, 6],
        [8, 6],
        [8, 5],
        [8, 4],
        [8, 3],
        [8, 2],
      ],
      blue: [
        [8, 13],
        [8, 12],
        [8, 11],
        [8, 10],
        [8, 9],
        [8, 8],
        [9, 8],
        [10, 8],
        [11, 8],
        [12, 8],
        [13, 8],
        [13, 7],
      ],
    };
  }

  getColor(color) {
    return {
      red: '#0ea5e9',
      green: '#10b981',
      yellow: '#f59e0b',
      blue: '#6366f1',
    }[color];
  }

  getStart(color) {
    return {
      red: [6, 0],
      green: [1, 6],
      yellow: [8, 13],
      blue: [13, 8],
    }[color];
  }

  validMoves(state) {
    const moves = [];
    const players = state.players || [];
    const current = state.currentPlayer;
    if (!players.length || current == null || current >= players.length) return moves;
    const player = players[current];
    const path = this.paths[player.color];
    if (!path) return moves;
    if (state.phase !== 'move') return moves;
    const taken = player.tokens && player.tokens.filter((t) => t.status === 'onTrack' || t.status === 'homeColumn').length;
    if (!taken) return moves;
    for (const token of player.tokens || []) {
      if (token.status === 'finished') continue;
      if ((token.status === 'yard' || token.status === 'home') && state.dice === 6) {
        moves.push({ token: token.id, type: 'release' });
      }
      moves.push({ token: token.id, type: 'advance' });
      if (token.status === 'onTrack' || token.status === 'homeColumn') moves.push({ token: token.id, type: 'move' });
    }
    return moves;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardManager;
}
