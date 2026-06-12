class DiceAnimation {
  static roll(el) {
    if (!el) return;
    el.classList.add('rolling');
    setTimeout(() => el.classList.remove('rolling'), 700);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiceAnimation;
}
