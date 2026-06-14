const fs = require('fs');
const path = require('path');

function adapt(filename) {
  const fp = path.join(__dirname, '..', 'frontend', filename);
  const code = fs.readFileSync(fp, 'utf8');
  const window = {};
  const exportsProxy = {};
  const moduleProxy = { exports: exportsProxy };

  const fn = new Function('module', 'exports', 'global', 'window', 'console', code);
  fn(moduleProxy, exportsProxy, global, window, console);

  const exported = moduleProxy.exports || exportsProxy || {};
  return Object.keys(exported).length > 0 ? exported : window;
}

module.exports = {
  PathGenerator: adapt('js/boards/PathGenerator.js'),
  GameEngine: adapt('js/core/GameEngine.js'),
  MovementEngine: adapt('js/core/MovementEngine.js'),
  CaptureEngine: adapt('js/core/CaptureEngine.js'),
  VictoryEngine: adapt('js/core/VictoryEngine.js'),
  AIManager: adapt('js/ai/AIManager.js'),
};
