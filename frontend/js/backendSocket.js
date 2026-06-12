if (typeof window === 'undefined') return;
const HOST = (location.hostname || '');
window.BACKEND = {
  origin: `http://${HOST}:3001`,
};
try {
  window.__SERVER = HOST === 'localhost' || HOST === '127.0.0.1' || HOST === '' ? true : false;
} catch (e) {}
