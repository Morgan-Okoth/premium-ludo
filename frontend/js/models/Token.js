class Token {
  constructor(color, index) {
    this.id = `${color}-${index}`;
    this.color = color;
    this.status = 'yard';
    this.pathIndex = null;
    this.r = null;
    this.c = null;
    this.homeColumnIndex = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Token;
}
