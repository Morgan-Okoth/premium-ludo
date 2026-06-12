class StoreUI {
  constructor(root) {
    this.root = root;
  }
  render(store) {
    this.root.innerHTML = `<div class="card"><h3>Store</h3><div>Gems: ${store?.currency ?? 0}</div></div>`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoreUI;
}
