class EasyBot extends BaseAI {
  constructor() {
    super('Easy');
  }
  decide(game) {
    const p = game.players[game.currentPlayer];
    if (!p || !p.tokens) return -1;
    const movable = p.tokens
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.status !== 'finished' && (t.status === 'yard' ? false : t.status === 'home' ? game.diceValue === 6 : true));

    const capture = movable.find(({ t }) => {
      if (t.status !== 'onTrack') return false;
      const r = t.r + (game.diceValuePath?.[0]?.r || 0);
      const c = t.c + (game.diceValuePath?.[0]?.c || 0);
      return game.players.some((op) => op.tokens.some((ot) => ot.r === r && ot.c === c && ot.color !== p.color));
    });

    return capture ? capture.i : movable[0]?.i ?? -1;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EasyBot;
}
