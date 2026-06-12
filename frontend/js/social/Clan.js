class Clan {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.members = [];
  }

  addMember(userId) {
    if (!this.members.includes(userId)) this.members.push(userId);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Clan;
}
