function buildClassicBoard() {
  const cells = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      const corner = cornerOf(r, c);
      const main = mainPath(r, c);
      const home = homePath(r, c);
      const unsafe = unsafeBlock(r, c);

      if (corner) cells.push({ r, c, type: 'home', color: corner });
      else if (main) cells.push({ r, c, type: 'path', path: 'main', safe: safeSpot(r, c) });
      else if (home) cells.push({ r, c, type: 'path', path: 'home', color: home.color, safe: false });
      else if (unsafe) cells.push({ r, c, type: 'block' });
      else cells.push({ r, c, type: 'block' });
    }
  }
  return cells;
}

function cornerOf(r, c) {
  if (r < 6 && c < 6) return 'red';
  if (r < 6 && c > 8) return 'green';
  if (r > 8 && c < 6) return 'yellow';
  if (r > 8 && c > 8) return 'blue';
  return null;
}

function mainPath(r, c) {
  const vertical = [0,1,2,3,4,5,7,8,9,10,11,12,13,14];
  const horizontal = [0,1,2,3,4,5,7,8,9,10,11,12,13,14];
  if ((c === 6 && vertical.includes(r)) || (r === 6 && horizontal.includes(c))) return true;
  if (r === 1 && c >= 1 && c <= 5) return true;
  if (r === 1 && c >= 9 && c <= 13) return true;
  if (c === 1 && r >= 7 && r <= 13) return true;
  if (c === 13 && r >= 1 && r <= 7) return true;
  if (r === 8 && c >= 1 && c <= 5) return true;
  if (r === 13 && c >= 9 && c <= 13) return true;
  if (c === 8 && r >= 1 && r <= 5) return true;
  if (c === 13 && r >= 9 && r <= 13) return true;
  return false;
}

function homePath(r, c) {
  if (r >= 1 && r <= 5 && c === 6) return { color: 'green' };
  if (r >= 9 && r <= 13 && c === 6) return { color: 'yellow' };
  if (r === 6 && c >= 1 && c <= 5) return { color: 'red' };
  if (r === 6 && c >= 9 && c <= 13) return { color: 'blue' };
  return null;
}

function unsafeBlock(r, c) {
  const blockZones = [
    [2,2],[2,3],[2,4],
    [2,10],[2,11],[2,12],
    [10,2],[10,3],[10,4],
    [10,10],[10,11],[10,12],
    [3,2],[4,2],
    [3,12],[4,12],
    [11,2],[12,2],
    [11,12],[12,12],
  ];
  return blockZones.some(p => p[0] === r && p[1] === c);
}

function safeSpot(r, c) {
  const safe = [
    [0,6],[6,0],[6,8],[8,8],[13,6],[8,13],[1,6],[13,6],
    [0,7],[14,7],[7,0],[7,14]
  ];
  return safe.some(p => p[0] === r && p[1] === c);
}

function buildHexBoard() {
  const size = 11;
  const center = Math.floor(size / 2);
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const dx = Math.abs(c - center);
      const dy = Math.abs(r - center);
      if (dx + dy > center) continue;
      cells.push({ r, c, hex: true });
    }
  }
  return { cells, size, center };
}

window.buildBoard = function(type) {
  if (type === 'hex') return buildHexBoard();
  return { cells: buildClassicBoard(), type: 'classic', size: 15 };
};

window.renderBoard = function(board, container) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'board-host';
  if (board.type === 'hex') renderHex(board, wrap);
  else renderClassic(board, wrap);
  container.appendChild(wrap);
};

function renderClassic(board, wrap) {
  const boardEl = document.createElement('div');
  boardEl.className = 'board ludo-classic';
  const cellSize = Math.max(22, Math.min(40, Math.floor((window.innerWidth * 0.82) / 15)));
  boardEl.style.gridTemplateColumns = `repeat(15, ${cellSize}px)`;
  boardEl.style.gridTemplateRows = `repeat(15, ${cellSize}px)`;

  board.cells.forEach(cell => {
    const el = document.createElement('div');
    el.className = 'cell';
    el.dataset.r = cell.r;
    el.dataset.c = cell.c;
    if (cell.type === 'home') el.classList.add('home-zone', `home-${cell.color}`);
    else if (cell.type === 'path' && cell.path === 'home') el.classList.add('home-lane', `lane-${cell.color}`);
    else if (cell.type === 'path') { el.classList.add('main-path'); if (cell.safe) el.classList.add('safe'); }
    else el.classList.add('blocked');
    boardEl.appendChild(el);
  });

  wrap.appendChild(boardEl);
  Object.entries({ red: [0,1,2,3,4,5], green: [0,1,2,3,4,5], yellow: [9,10,11,12,13,14], blue: [9,10,11,12,13,14] }).forEach(([color, rows]) => {
    const zone = document.createElement('div');
    zone.className = `home-zone ${color} home-tokens`;
    for (let i = 0; i < 4; i++) {
      const t = document.createElement('div');
      t.className = 'token';
      zone.appendChild(t);
    }
    wrap.appendChild(zone);
  });
}

function renderHex(board, wrap) {
  const boardEl = document.createElement('div');
  boardEl.className = 'board ludo-hex';
  const cellSize = Math.max(18, Math.min(32, Math.floor((window.innerWidth * 0.88) / (board.size * 2.3))));
  boardEl.style.gridTemplateColumns = `repeat(${board.size}, ${cellSize}px)`;
  boardEl.style.gridTemplateRows = `repeat(${board.size}, ${cellSize}px)`;

  const map = new Map(board.cells.map(c => [`${c.r},${c.c}`, c]));
  for (let r = 0; r < board.size; r++) {
    for (let c = 0; c < board.size; c++) {
      const cell = map.get(`${r},${c}`);
      const el = document.createElement('div');
      el.className = 'cell hex-cell';
      if (!cell) { el.style.visibility = 'hidden'; boardEl.appendChild(el); continue; }
      el.dataset.r = r;
      el.dataset.c = c;
      boardEl.appendChild(el);
    }
  }
  wrap.appendChild(boardEl);
}

window.placeTokens = function(board, players) {
  document.querySelectorAll('.cell .token').forEach(n => n.remove());
  players.forEach(player => {
    (player.tokens || []).forEach(token => {
      if (!token || token.status === 'yard' || token.status === 'finished') return;
      const r = token.r, c = token.c;
      if (r == null || c == null) return;
      const cell = document.querySelector(`.cell[data-r='${r}'][data-c='${c}']`);
      if (!cell) return;
      const el = document.createElement('div');
      el.className = `token ${token.color}`;
      el.textContent = '●';
      el.title = `${player.name}`;
      cell.appendChild(el);
    });
  });
};

window.refreshBoard = function(container, board, players) {
  window.renderBoard(board, container);
  window.placeTokens(board, players);
};
