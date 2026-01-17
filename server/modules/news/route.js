const express = require('express');
const { listNews, getNews, createNews, updateNews, deleteNews } = require('./controller');
const { requireAuth } = require('../../app/middlewares/auth');
const { cacheMiddleware } = require('../../app/middlewares/cache');

const router = express.Router();

router.get('/', cacheMiddleware, listNews);
router.get('/:id', cacheMiddleware, getNews);
router.post('/', requireAuth, createNews);
router.put('/:id', requireAuth, updateNews);
router.delete('/:id', requireAuth, deleteNews);

module.exports = router;
