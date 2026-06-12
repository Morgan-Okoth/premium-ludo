class Store {
  constructor() {
    this.items = [
      { id: 'board_1', name: 'Royal Board', price: 200, type: 'board' },
      { id: 'dice_1', name: 'Golden Dice', price: 150, type: 'dice' },
      { id: 'avatar_1', name: 'Crown Avatar', price: 300, type: 'avatar' },
    ];
    this.currency = parseInt(localStorage.getItem('ludo-gems') || '500', 10);
  }

  purchase(id) {
    const item = this.items.find((i) => i.id === id);
    if (!item || this.currency < item.price) return false;
    this.currency -= item.price;
    localStorage.setItem('ludo-gems', String(this.currency));
    const owned = JSON.parse(localStorage.getItem('ludo-owned') || '[]');
    if (!owned.includes(id)) owned.push(id);
    localStorage.setItem('ludo-owned', JSON.stringify(owned));
    return true;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Store;
}
