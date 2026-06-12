const http = require('http');

function check(url, label) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ label, status: res.statusCode, data: data.slice(0, 200) }));
    }).on('error', (e) => resolve({ label, error: e.message }));
  });
}

(async () => {
  const results = await Promise.all([check('http://localhost:3000/index.html', 'frontend-index'), check('http://localhost:3000/game.html', 'frontend-game'), check('http://localhost:3001/health', 'backend-health')]);
  const ok = results.every((r) => !r.error && r.status < 500);
  console.log(results.map((r) => `${r.label}: ${r.status || r.error}`).join('\n'));
  process.exit(ok ? 0 : 1);
})();
