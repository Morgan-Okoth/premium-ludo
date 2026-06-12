class Fireworks {
  static burst(container) {
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'fx-fireworks';
    el.textContent = '🎆';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}
window.Fireworks = Fireworks;
