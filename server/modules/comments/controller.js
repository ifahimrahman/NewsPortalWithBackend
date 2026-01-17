const commentService = require('./service');
const { clearCache } = require('../../app/middlewares/cache');

async function getComments(req, res, next) {
  try {
    const comments = await commentService.listByNews(req.params.newsId);
    res.json(comments);
  } catch (err) { next(err); }
}

async function createComment(req, res, next) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Comment content required' });
    const comment = await commentService.create({
      content,
      author: req.user.id,
      news: req.params.newsId
    });
    // Clear cache for this news' comments
    clearCache(`/api/comments/news/${req.params.newsId}`);
    res.status(201).json(comment);
  } catch (err) { next(err); }
}

async function updateComment(req, res, next) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Comment content required' });
    
    const comment = await commentService.getById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Only admin or comment owner can update
    if (String(comment.author._id) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - only owner or admin can update' });
    }
    
    const updated = await commentService.update(req.params.id, { content });
    // Clear cache for this news' comments
    clearCache(`/api/comments/news/${comment.news}`);
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteComment(req, res, next) {
  try {
    const comment = await commentService.getById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Only admin or comment owner can delete
    if (String(comment.author._id) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - only owner or admin can delete' });
    }
    
    await commentService.remove(req.params.id);
    // Clear cache for this news' comments
    clearCache(`/api/comments/news/${comment.news}`);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getComments, createComment, updateComment, deleteComment };
