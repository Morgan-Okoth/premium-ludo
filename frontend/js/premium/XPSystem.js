class XPSystem {
  constructor() {
    this.level = parseInt(localStorage.getItem('ludo-level') || '1', 10);
    this.xp = parseInt(localStorage.getItem('ludo-xp') || '0', 10);
    this.thresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300];
  }

  add(amount) {
    this.xp += amount;
    this.persist();
  }

  levelUpAmount() {
    const idx = Math.min(this.level - 1, this.thresholds.length - 2);
    return this.thresholds[idx + 1] - this.thresholds[idx];
  }

  progress() {
    const current = this.thresholds[this.level - 1] || 0;
    const next = this.thresholds[this.level] || this.thresholds[this.thresholds.length - 1];
    const needed = next - current;
    const pct = Math.min(100, ((this.xp - current) / needed) * 100);
    return { current: this.xp, needed, pct, level: this.level };
  }

  tryLevelUp() {
    const idx = Math.min(this.level - 1, this.thresholds.length - 2);
    const required = this.thresholds[idx + 1];
    if (this.xp >= required && this.level < this.thresholds.length) {
      this.level++;
      this.persist();
      return true;
    }
    return false;
  }

  persist() {
    localStorage.setItem('ludo-level', String(this.level));
    localStorage.setItem('ludo-xp', String(this.xp));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = XPSystem;
}
