const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../app/models/User');
const News = require('../app/models/News');
const jwt = require('jsonwebtoken');
const config = require('../app/config');

dotenv.config();

function run() {
  const uri = config.mongoUri;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    console.log('Connected to DB for seeding');

    await User.deleteMany({});
    await News.deleteMany({});

    const users = [
      { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
      { name: 'Author One', email: 'author1@example.com', password: 'password', role: 'author' },
      { name: 'Reader One', email: 'reader1@example.com', password: 'password', role: 'reader' }
    ];

    for (const u of users) {
      const hashed = bcrypt.hashSync(u.password, 10);
      const created = await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
      u._id = created._id;
    }

    const newsItems = [
      { title: 'Welcome to the News App', content: 'This is the first seeded article.', author: users[1]._id },
      { title: 'Admin Announcement', content: 'Important admin announcement.', author: users[0]._id }
    ];

    for (const n of newsItems) await News.create(n);

    console.log('\nSeed complete. Tokens:');
    for (const u of users) {
      const token = jwt.sign({ id: u._id, role: u.role }, config.jwtSecret, { expiresIn: '7d' });
      console.log(`${u.email}: ${token}`);
    }

    mongoose.disconnect();
  }).catch(err => { console.error(err); process.exit(1); });
}

run();
