class DailyMissions {
  constructor() {
    this.missions = [
      { id: 1, name: 'Play 3 games', target: 3, progress: 0, reward: 50, xp: 20 },
      { id: 2, name: 'Win 1 game', target: 1, progress: 0, reward: 100, xp: 50 },
      { id: 3, name: 'Capture 5 tokens', target: 5, progress: 0, reward: 75, xp: 30 },
    ];
    this.lastRefresh = localStorage.getItem('ludo-missions-date');
    this.refreshIfNeeded();
  }

  refreshIfNeeded() {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastRefresh !== today) {
      this.missions.forEach((m) => (m.progress = 0));
      this.lastRefresh = today;
      localStorage.setItem('ludo-missions-date', today);
    }
  }

  record(type, amount = 1) {
    const mission = this.missions.find((m) => this.typeMatches(m, type));
    if (mission && mission.progress < mission.target) {
      mission.progress = Math.min(mission.target, mission.progress + amount);
      if (mission.progress >= mission.target) {
        return mission;
      }
    }
    return null;
  }

  typeMatches(mission, type) {
    return type === 'play' ? mission.id === 1 : type === 'win' ? mission.id === 2 : type === 'capture' ? mission.id === 3 : false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyMissions;
}
