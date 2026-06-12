class Tournament {
  constructor(maxRounds = 3) {
    this.maxRounds = maxRounds;
    this.currentRound = 0;
    this.results = [];
  }

  record(result) {
    this.results.push(result);
  }

  getOverallWinner() {
    const scores = {};
    for (const r of this.results) {
      scores[r.winner] = (scores[r.winner] || 0) + 1;
    }
    let best = null;
    for (const [c, s] of Object.entries(scores)) {
      if (!best || s > best.score) best = { color: c, score: s };
    }
    return best;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Tournament;
}
