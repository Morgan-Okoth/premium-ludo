class Particles {
  static emit(container) {
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'fx-particles';
    el.textContent = '✨';
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}
window.Particles = Particles;
