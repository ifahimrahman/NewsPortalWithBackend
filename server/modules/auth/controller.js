const authService = require('./service');

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await authService.authenticate(req.body);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { register, login };
