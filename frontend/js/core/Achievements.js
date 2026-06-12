class Achievements {
  constructor() {
    this.unlocked = JSON.parse(localStorage.getItem('premium-ludo-achievements') || '[]');
  }

  check(stats) {
    const newOnes = [];
    if (!this.unlocked.includes('first_win') && stats.gamesPlayed > 0 && stats.wins > 0) {
      this.unlocked.push('first_win');
      newOnes.push('first_win');
    }
    localStorage.setItem('premium-ludo-achievements', JSON.stringify(this.unlocked));
    return newOnes;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Achievements;
}
