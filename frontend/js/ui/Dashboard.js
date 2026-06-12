class Dashboard {
  constructor(root) {
    this.root = root;
  }
  render(stats, missions, xp) {
    this.root.innerHTML = `
      <div class="card"><h3>Stats</h3><div>${stats || 'No stats yet'}</div></div>
      <div class="card"><h3>Missions</h3><div>${missions || 'No missions active'}</div></div>
      <div class="card"><h3>XP</h3><div>${xp || '0'}</div></div>
    `;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Dashboard;
}
