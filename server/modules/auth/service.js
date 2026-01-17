const bcrypt = require('bcryptjs');
const User = require('../../app/models/User');
const jwt = require('jsonwebtoken');
const config = require('../../app/config');

async function registerUser({ name, email, password, role }) {
  if (!name || !email || !password) throw { status: 400, message: 'Missing fields' };
  const existing = await User.findOne({ email });
  if (existing) throw { status: 409, message: 'Email already in use' };
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

async function authenticate({ email, password }) {
  if (!email || !password) throw { status: 400, message: 'Missing fields' };
  const user = await User.findOne({ email });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

module.exports = { registerUser, authenticate };
