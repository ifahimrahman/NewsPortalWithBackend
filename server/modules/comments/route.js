const express = require('express');
const { getComments, createComment, updateComment, deleteComment } = require('./controller');
const { requireAuth } = require('../../app/middlewares/auth');
const { commentLimiter } = require('../../app/middlewares/rateLimit');
const { cacheMiddleware } = require('../../app/middlewares/cache');

const router = express.Router();

// Apply cache and rate limiting to all comment routes
router.use(commentLimiter);

// Get comments for a news (cached)
router.get('/news/:newsId', cacheMiddleware, getComments);

// Create new comment (requires auth)
router.post('/news/:newsId', requireAuth, createComment);

// Update comment (requires auth - only owner or admin)
router.put('/:id', requireAuth, updateComment);

// Delete comment (requires auth - only owner or admin)
router.delete('/:id', requireAuth, deleteComment);

module.exports = router;
