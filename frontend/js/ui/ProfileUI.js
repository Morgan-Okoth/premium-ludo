class ProfileUI {
  constructor(root) {
    this.root = root;
  }
  render(user = {}) {
    this.root.innerHTML = `
      <div class="card">
        <h3>Profile</h3>
        <div>Level ${user.level ?? 1}</div>
        <div>XP ${user.xp ?? 0}</div>
      </div>
    `;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileUI;
}
