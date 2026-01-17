const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/newsdb',
  jwtSecret: process.env.JWT_SECRET || 'replace_this',
  port: process.env.PORT || 4000
};

module.exports = config;
