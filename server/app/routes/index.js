const express = require('express');
const authRoutes = require('../../modules/auth/route');
const newsRoutes = require('../../modules/news/route');
const commentRoutes = require('../../modules/comments/route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
