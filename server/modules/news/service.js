const News = require('../../app/models/News');

async function listAll() {
  return News.find().populate('author', 'name email').sort({ createdAt: -1 });
}

async function getById(id) {
  return News.findById(id).populate('author', 'name email');
}

async function create(data) {
  return News.create(data);
}

async function update(id, updates) {
  const item = await News.findById(id);
  if (!item) return null;
  Object.assign(item, updates);
  await item.save();
  return item;
}

async function remove(id) {
  const item = await News.findById(id);
  if (!item) return null;
  await item.remove();
  return item;
}

module.exports = { listAll, getById, create, update, remove };
