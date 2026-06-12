const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let frame = null;
let width = 0;
let height = 0;
let dpr = window.devicePixelRatio || 1;
const text = 'MORGANENTP';
let orbitRadius = 0;
let centerX = 0;
let centerY = 0;
let angle = 0;
let running = false;

function resize() {
  const wrap = document.querySelector('.board-wrap');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  if (width < 1 || height < 1) return;
  orbitRadius = (Math.min(width, height) * 0.72) / 2;
  centerX = width / 2;
  centerY = height / 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  if (!running) return;
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < text.length; i++) {
    const a = angle + (i / text.length) * Math.PI * 2;
    const x = centerX + Math.cos(a) * orbitRadius;
    const y = centerY + Math.sin(a) * orbitRadius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + Math.PI / 2);
    ctx.font = '700 14px system-ui';
    ctx.fillStyle = '#f5c842';
    ctx.shadowColor = '#f5c842';
    ctx.shadowBlur = 16;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text[i] === ' ' ? '' : text[i], 0, 0);
    ctx.restore();
  }
  angle += 0.012;
  requestAnimationFrame(draw);
}

function stop() {
  running = false;
}

function start() {
  if (running) return;
  running = true;
  if (!frame) {
    frame = canvas;
    document.body.appendChild(frame);
    frame.style.position = 'fixed';
    frame.style.inset = '0';
    frame.style.pointerEvents = 'none';
    frame.style.zIndex = '0';
  }
  resize();
  draw();
}

window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 100));

export default { start, stop };
