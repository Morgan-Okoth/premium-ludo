class Statistics {
  constructor() {
    this.history = JSON.parse(localStorage.getItem('premium-ludo-stats') || '[]');
  }

  recordGame(result) {
    this.history.push({
      ...result,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    });
    if (this.history.length > 200) this.history.shift();
    localStorage.setItem('premium-ludo-stats', JSON.stringify(this.history));
  }

  getWinRate(color) {
    const total = this.history.length;
    if (total === 0) return 0;
    const wins = this.history.filter((g) => g.winner === color).length;
    return (wins / total) * 100;
  }

  getStats() {
    return {
      gamesPlayed: this.history.length,
      wins: this.history.filter((g) => g.tied === false).length,
      ties: this.history.filter((g) => g.tied === true).length,
      lastResult: this.history[this.history.length - 1],
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Statistics;
}
