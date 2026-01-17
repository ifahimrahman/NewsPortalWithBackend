const newsService = require('./service');
const { clearCache } = require('../../app/middlewares/cache');

async function listNews(req, res, next) {
  try {
    const items = await newsService.listAll();
    res.json(items);
  } catch (err) { next(err); }
}

async function getNews(req, res, next) {
  try {
    const item = await newsService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
}

async function createNews(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
    const news = await newsService.create({ title, content, author: req.user.id });
    clearCache('/api/news');
    res.status(201).json(news);
  } catch (err) { next(err); }
}

async function updateNews(req, res, next) {
  try {
    const existing = await newsService.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (String(existing.author) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const updated = await newsService.update(req.params.id, { title: req.body.title, content: req.body.content });
    clearCache('/api/news');
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteNews(req, res, next) {
  try {
    const existing = await newsService.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (String(existing.author) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await newsService.remove(req.params.id);
    clearCache('/api/news');
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

module.exports = { listNews, getNews, createNews, updateNews, deleteNews };
