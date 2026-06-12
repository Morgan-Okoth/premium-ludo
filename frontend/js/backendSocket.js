if (typeof window === 'undefined') return;
const HOST = (location.hostname || '');
window.BACKEND = {
  origin: HOST === 'localhost' || HOST === '127.0.0.1' || HOST === '' ? 'http://localhost:3001' : 'https://premium-ludo-backend.onrender.com',
};
try {
  window.__SERVER = HOST === 'localhost' || HOST === '127.0.0.1' || HOST === '' ? true : false;
} catch (e) {}
