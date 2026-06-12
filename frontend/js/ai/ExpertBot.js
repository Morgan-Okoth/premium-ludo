class ExpertBot extends BaseAI {
  constructor() {
    super('Expert');
  }
  decide(game) {
    const p = game.players[game.currentPlayer];
    if (!p || !p.tokens) return -1;
    const options = p.tokens
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.status !== 'finished' && (t.status === 'yard' || t.status === 'home' ? game.diceValue === 6 : true));

    const selected = options.reduce((best, cur) => {
      const v = this.simulate(game, cur.t, cur.i, game.diceValue);
      return v > best.value ? { value: v, i: cur.i } : best;
    }, { value: -Infinity, i: -1 });
    return selected.i;
  }

  simulate(game, token, index, steps) {
    if (token.status === 'finished') return -10;
    if (token.status === 'yard' || token.status === 'home') return steps === 6 ? 1 : 0;

    const next = token.pathIndex + steps;
    const safe = [
      [6, 1],
      [2, 1],
      [6, 8],
      [8, 8],
      [13, 8],
      [8, 13],
      [1, 6],
      [13, 6],
      [0, 6],
      [6, 0],
      [0, 7],
      [14, 7],
    ];
    const target = token.pathIndex >= next ? false : safe.some(([r, c]) => r === token.r && c === token.c);

    const threatens = game.players.some((op) => op.tokens.some((t) => t.r === token.r && t.c === token.c && t.color !== token.color));
    return next + (threatens ? 3 : 0) + (target ? 2 : 0);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExpertBot;
}
