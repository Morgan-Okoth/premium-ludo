class AIManager {
  constructor() {
    this.easy = new EasyBot();
    this.medium = new MediumBot();
    this.expert = new ExpertBot();
  }

  pick(difficulty, gameState) {
    const bots = { easy: this.easy, medium: this.medium, expert: this.expert };
    const bot = bots[difficulty] || this.medium;
    return bot.decide(gameState);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIManager;
}
