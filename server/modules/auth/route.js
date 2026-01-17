const express = require('express');
const { register, login } = require('./controller');
const { authLimiter } = require('../../app/middlewares/rateLimit');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

module.exports = router;
