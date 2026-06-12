class ThreeDDice {
  static render(container) {
    if (!container) return;
    container.className = 'dice';
    container.textContent = '🎲';
  }
}
window.ThreeDDice = ThreeDDice;
