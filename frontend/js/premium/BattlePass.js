class BattlePass {
  constructor() {
    this.season = 1;
    this.tiers = Array.from({ length: 100 }, (_, i) => ({ tier: i + 1, xpRequired: (i + 1) * 100, free: i % 2 === 0, premium: i % 3 === 0 }));
  }

  claimReward(tier, premium = false) {
    const reward = this.tiers.find((t) => t.tier === tier);
    return reward && (premium ? reward.premium : reward.free) ? reward : null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BattlePass;
}
