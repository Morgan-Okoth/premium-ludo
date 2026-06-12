class BaseAI {
  constructor(name = 'AI') {
    this.name = name;
  }
  decide(gameState) {
    return -1;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseAI;
}
