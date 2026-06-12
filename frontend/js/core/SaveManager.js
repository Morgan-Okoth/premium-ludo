class SaveManager {
  constructor(storageKey = 'premium-ludo-save') {
    this.key = storageKey;
  }

  save(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
    } catch (e) {
      console.warn('Save failed', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaveManager;
}
