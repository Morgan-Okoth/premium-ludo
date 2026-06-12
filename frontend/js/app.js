(() => {
  const countSel = document.getElementById('playerCount');
  const modeSel = document.getElementById('mode');
  const slotsEl = document.getElementById('slots');
  const startBtn = document.getElementById('startBtn');

  const classicColors = ['red', 'green', 'yellow', 'blue'];
  const hexColors = ['red', 'green', 'yellow', 'blue', 'violet', 'teal'];

  function renderSlots() {
    const count = Number(countSel.value);
    const palette = count <= 4 ? classicColors : hexColors;
    slotsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.innerHTML = `
        <div class="slot-header">
          <span class="color-dot" style="background:${palette[i]}"></span>
          <strong>Player ${i + 1}</strong>
        </div>
        <label>Name<input value="Player ${i + 1}" /></label>
        <label>
          <select class="ai-pick">
            <option value="human">Human</option>
            <option value="bot">Bot (Medium)</option>
          </select>
        </label>
      `;
      slotsEl.appendChild(slot);
    }
  }

  startBtn.addEventListener('click', () => {
    const count = Number(countSel.value);
    if (count < 1 || count > 6) {
      alert('Select 1-6 players');
      return;
    }
    const mode = modeSel.value;
    const palette = count <= 4 ? classicColors : hexColors;
    const slots = Array.from(slotsEl.querySelectorAll('.slot'));
    const players = slots.map((el, idx) => ({
      name: el.querySelector('label input').value || `Player ${idx + 1}`,
      color: palette[idx],
      isBot: el.querySelector('.ai-pick').value === 'bot',
    }));

    const humans = players.filter((p) => !p.isBot).length;
    if (humans === 0) {
      alert('At least one human player required');
      return;
    }

    const totalTarget = 6;
    while (players.length < totalTarget) {
      players.push({
        name: `Bot ${players.length + 1}`,
        color: palette[players.length],
        isBot: true,
      });
    }

    const setup = {
      players,
      board: players.length <= 4 ? 'classic' : 'hex',
      mode,
    };

    localStorage.setItem('ludo-setup', JSON.stringify(setup));
    window.location.href = 'game.html';
  });

  countSel.addEventListener('change', renderSlots);
  renderSlots();
})();
