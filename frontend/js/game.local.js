(() => {
  const setupRaw = localStorage.getItem('ludo-setup');
  if (!setupRaw) { window.location.href = 'index.html'; return; }
  const setup = JSON.parse(setupRaw);
  const statusLine = document.getElementById('statusLine');
  const turnBanner = document.getElementById('turnBanner');
  const boardWrap = document.getElementById('boardWrap');
  const diceEl = document.getElementById('dice');
  const rollBtn = document.getElementById('rollBtn');

  const engine = new GameEngine(setup.players.length, setup.players.map((p, i) => ({ ...p, id: `player-${i}` })));
  for (const p of engine.players) {
    p.tokens = (p.tokens || []).map((t, idx) => ({ ...t, color: p.color, owner: p.name, homeIndex: idx }));
  }

  const aiManager = new AIManager();
  let validTokenIndex = -1;
  let board = buildBoard(setup.board);
  const players = engine.players.map((p, i) => ({
    ...p,
    tokens: [0,1,2,3].map(n => ({ id: `${p.color}-${n}`, color: p.color, status: 'yard', pathIndex: null, r: null, c: null, homeColumnIndex: null, homeIndex: n }))
  }));
  engine.players = players;

  function setStatus(msg) { statusLine.textContent = msg; }
  function setTurn() {
    const p = engine.players[engine.currentPlayer];
    turnBanner.innerHTML = `<span class="turn-dot" style="background:${p.color}"></span> ${p.name}`;
  }

  function refreshBoard() {
    if (typeof window.renderBoard === 'function') window.renderBoard(board, boardWrap);
    else if (typeof render === 'function') render(board, boardWrap);
    if (typeof window.placeTokens === 'function') window.placeTokens(board, engine.players);
    else if (typeof placeTokens === 'function') placeTokens(board, engine.players);
  }

  function animateDice() {
    if (typeof DiceAnimation !== 'undefined' && DiceAnimation.roll) DiceAnimation.roll(diceEl);
    else diceEl.classList.add('rolling');
    setTimeout(() => diceEl.classList.remove('rolling'), 600);
  }

  function afterMove() {
    placeTokens(board, engine.players);
    if (engine.checkWinCondition(engine.players[engine.currentPlayer])) {
      setStatus(`${engine.players[engine.currentPlayer].name} wins!`);
      rollBtn.disabled = true;
      if (typeof Particles !== 'undefined' && Particles.emit) Particles.emit(document.body);
      else {
        const el = document.createElement('div');
        el.className = 'fx-particles';
        el.textContent = '✨';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
      }
      return;
    }
    setTurn();
    const movable = (engine.players[engine.currentPlayer].tokens || [])
      .findIndex((t) => t.status === 'onTrack' || t.status === 'homeColumn');
    if (movable >= 0) {
      validTokenIndex = movable;
      setStatus('Choose a token to move');
      rollBtn.disabled = true;
    } else {
      validTokenIndex = -1;
      setStatus('Auto skipping turn');
      setTimeout(autoTurn, 800);
    }
  }

  function autoTurn() {
    const p = engine.players[engine.currentPlayer];
    if (!p.isBot) { rollBtn.disabled = false; setStatus('Roll dice'); return; }
    const dice = Math.floor(Math.random() * 6) + 1;
    engine.diceValue = dice;
    engine.turnPhase = 'move';
    diceEl.textContent = dice;
    animateDice();
    setStatus(`${p.name} rolled ${dice}`);
    setTimeout(() => {
      const choice = aiManager.pick('medium', engine.getState());
      if (choice < 0) { engine.finishTurn(p, false); afterMove(); return; }
      engine.moveToken(p, choice);
      afterMove();
    }, 700);
  }

  rollBtn.addEventListener('click', () => {
    const p = engine.players[engine.currentPlayer];
    if (p.isBot) return;
    const dice = Math.floor(Math.random() * 6) + 1;
    engine.rollDie();
    diceEl.textContent = dice;
    animateDice();
    setStatus(`${p.name} rolled ${dice}`);
    const movable = (p.tokens || []).findIndex((t) => t.status === 'onTrack' || t.status === 'homeColumn');
    if (movable < 0) {
      setStatus('No moves, skipping');
      setTimeout(() => { engine.finishTurn(p, false); afterMove(); }, 600);
    } else {
      validTokenIndex = movable;
      setStatus('Click a token to move');
    }
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    new SaveManager().save(engine.getState());
    setStatus('Saved');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    engine.reset();
    engine.players.forEach((p, i) => {
      p.name = setup.players[i]?.name || p.name;
      p.isBot = setup.players[i]?.isBot || false;
    });
    validTokenIndex = -1;
    rollBtn.disabled = false;
    diceEl.textContent = '-';
    board = buildBoard(setup.board);
    refreshBoard();
    setTurn();
    setStatus('Roll to start');
  });

  document.getElementById('quitBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  refreshBoard();
  setTurn();
  setStatus('Roll to start');
  if (typeof startOrbit === 'function') startOrbit();
})();
