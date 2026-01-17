const Comment = require('../../app/models/Comment');

async function listByNews(newsId) {
  return await Comment.find({ news: newsId }).populate('author', 'name email').sort({ createdAt: -1 });
}

async function create(data) {
  return await Comment.create(data).then(c => c.populate('author', 'name email'));
}

async function getById(id) {
  return await Comment.findById(id).populate('author', 'name email');
}

async function update(id, data) {
  return await Comment.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name email');
}

async function remove(id) {
  return await Comment.findByIdAndDelete(id);
}

module.exports = { listByNews, create, getById, update, remove };
