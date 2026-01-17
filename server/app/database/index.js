const mongoose = require('mongoose');
const config = require('../config');

function connectDB() {
  const uri = config.mongoUri;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => { console.error('MongoDB connection error:', err); process.exit(1); });
}

module.exports = connectDB;
