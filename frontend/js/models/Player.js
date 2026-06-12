class Player {
  constructor(color, name, isAI = false, difficulty = 'medium') {
    this.color = color;
    this.name = name;
    this.isAI = isAI;
    this.aiDifficulty = difficulty;
    this.tokens = [0, 1, 2, 3].map((i) => ({
      id: `${color}-${i}`,
      color,
      status: 'yard',
      pathIndex: null,
      r: null,
      c: null,
      homeColumnIndex: null,
    }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Player;
}
