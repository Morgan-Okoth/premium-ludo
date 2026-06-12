class Friends {
  constructor() {
    this.list = JSON.parse(localStorage.getItem('ludo-friends') || '[]');
  }

  add(friendId) {
    if (!this.list.includes(friendId)) this.list.push(friendId);
  }

  remove(friendId) {
    this.list = this.list.filter((id) => id !== friendId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Friends;
}
