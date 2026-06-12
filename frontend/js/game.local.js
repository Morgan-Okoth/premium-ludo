(() => {
  const setupRaw = localStorage.getItem('ludo-setup');
  if (!setupRaw) {
    window.location.href = 'index.html';
    return;
  }
  const setup = JSON.parse(setupRaw);
  const statusLine = document.getElementById('statusLine');
  const turnBanner = document.getElementById('turnBanner');
  const boardWrap = document.getElementById('boardWrap');
  const diceEl = document.getElementById('dice');
  const rollBtn = document.getElementById('rollBtn');

  const engine = new GameEngine(setup.players.length, setup.players, setup.board);
  const aiManager = new AIManager();
  let validTokenIndex = -1;

  function setStatus(msg) {
    statusLine.textContent = msg;
  }

  function setTurn() {
    const p = engine.players[engine.currentPlayer];
    turnBanner.innerHTML = `<span class="turn-dot" style="background:${p.color}"></span> ${p.name}`;
  }

  function renderBoard() {
    boardWrap.innerHTML = '';
    const board = document.createElement('div');
    board.className = `board ${setup.board === 'hex' ? 'hex' : 'classic'}`;
    board.style.setProperty('--size', setup.board === 'hex' ? '15' : '15');
    const size = setup.board === 'hex' ? 15 : 15;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        board.appendChild(cell);
      }
    }
    boardWrap.appendChild(board);
  }

  function cellFor(r, c) {
    return boardWrap.querySelector(`.cell[data-r='${r}'][data-c='${c}']`);
  }

  function placeTokens() {
    document.querySelectorAll('.token').forEach((n) => n.remove());
    engine.players.forEach((p) => {
      (p.tokens || []).forEach((token) => {
        if (token.status === 'yard' || token.status === 'finished') return;
        const cell = cellFor(token.r, token.c);
        if (!cell) return;
        const el = document.createElement('div');
        el.className = `token ${token.color}`;
        el.textContent = '●';
        el.title = `${p.name}`;
        cell.appendChild(el);
      });
    });
  }

  function finishTurnForCurrent(extra) {
    const p = engine.players[engine.currentPlayer];
    engine.finishTurn(p, !!extra);
  }

  function afterMove() {
    placeTokens();
    if (engine.checkWinCondition(engine.players[engine.currentPlayer])) {
      setStatus(`${engine.players[engine.currentPlayer].name} wins!`);
      rollBtn.disabled = true;
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
    if (!p.isBot) {
      rollBtn.disabled = false;
      setStatus('Roll dice');
      return;
    }
    const dice = Math.floor(Math.random() * 6) + 1;
    engine.diceValue = dice;
    engine.turnPhase = 'move';
    diceEl.textContent = dice;
    setStatus(`${p.name} rolled ${dice}`);
    setTimeout(() => {
      const choice = aiManager.pick('medium', engine.getState());
      if (choice < 0) {
        finishTurnForCurrent(false);
        afterMove();
        return;
      }
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
    setStatus(`${p.name} rolled ${dice}`);
    const movable = (p.tokens || []).findIndex((t) => t.status === 'onTrack' || t.status === 'homeColumn');
    if (movable < 0) {
      setStatus('No moves, skipping');
      setTimeout(() => {
        finishTurnForCurrent(false);
        afterMove();
      }, 600);
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
    renderBoard();
    setTurn();
    setStatus('Roll to start');
  });

  document.getElementById('quitBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  function renderBoard() {
    boardWrap.innerHTML = '';
    const board = document.createElement('div');
    board.className = `board ${setup.board === 'hex' ? 'hex' : ''}`;
    board.style.setProperty('--size', setup.board === 'hex' ? '11' : '15');
    const size = setup.board === 'hex' ? 11 : 15;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        board.appendChild(cell);
      }
    }
    boardWrap.appendChild(board);
  }

  renderBoard();
  setTurn();
  setStatus('Roll to start');
})();
