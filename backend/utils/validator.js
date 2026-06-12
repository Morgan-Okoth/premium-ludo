function validateEmail(email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}
function validateUsername(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

module.exports = { validateEmail, validatePassword, validateUsername };
