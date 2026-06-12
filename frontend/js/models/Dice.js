class Dice {
  constructor() {
    this.value = null;
    this.rolling = false;
  }

  roll() {
    this.rolling = true;
    this.value = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => (this.rolling = false), 600);
    return this.value;
  }

  reset() {
    this.value = null;
    this.rolling = false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Dice;
}
