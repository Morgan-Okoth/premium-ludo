class ThreeDDice {
  static render(container) {
    if (!container) return;
    container.className = 'dice';
    container.textContent = '🎲';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThreeDDice;
}
