class VictoryEngine {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  checkWin(player) {
    return player.tokens.every((t) => t.status === 'finished');
  }

  declareWinner(player) {
    this.game.winner = player.color;
  }

  getRankings() {
    const rankings = [];
    for (const p of this.game.players) {
      const finished = p.tokens.filter((t) => t.status === 'finished').length;
      rankings.push({ color: p.color, name: p.name, finished });
    }
    rankings.sort((a, b) => b.finished - a.finished);
    return rankings;
  }

  reset() {
    this.game.winner = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VictoryEngine;
}
