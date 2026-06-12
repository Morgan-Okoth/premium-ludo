class CaptureEngine {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  checkCapture(player, token) {
    const pos = { r: token.r, c: token.c };
    if (this.game.isSafeSpot(pos)) return false;

    for (const opponent of this.game.players) {
      if (opponent.color === player.color) continue;
      for (const ot of opponent.tokens) {
        if (ot.status === 'onTrack' && ot.r === pos.r && ot.c === pos.c) {
          ot.status = 'yard';
          ot.r = null;
          ot.c = null;
          ot.pathIndex = null;
          this.game.captures[player.color] = (this.game.captures[player.color] || 0) + 1;
          return true;
        }
      }
    }
    return false;
  }

  getTotalCaptures(color) {
    return this.game.captures[color] || 0;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CaptureEngine;
}
