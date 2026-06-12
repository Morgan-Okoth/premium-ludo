class MediumBot extends BaseAI {
  constructor() {
    super('Medium');
  }
  decide(game) {
    const p = game.players[game.currentPlayer];
    if (!p || !p.tokens) return -1;
    const candidates = p.tokens
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.status !== 'finished' && (t.status === 'yard' || t.status === 'home' ? game.diceValue === 6 : true));

    const best = candidates.reduce((a, b) => {
      const sa = this.score(game, a.t, a.i);
      const sb = this.score(game, b.t, b.i);
      return sb > sa ? b : a;
    }, { t: candidates[0]?.t, i: -1 });
    return best.i;
  }

  score(game, token, index) {
    if (token.status === 'finished') return -10;
    if (token.status === 'yard' || token.status === 'home') {
      return game.diceValue === 6 ? 0.5 : 0;
    }
    const r = token.r;
    const c = token.c;
    const threaten = game.players.some((op) => op.tokens.some((t) => t.status === 'onTrack' && t.color !== game.players[game.currentPlayer].color && t.r === r && t.c === c));
    return (token.pathIndex ?? 0) + (threaten ? 2 : 0);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediumBot;
}
