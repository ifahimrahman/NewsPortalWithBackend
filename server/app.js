const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./app/database');
const routes = require('./app/routes');
const { errorHandler } = require('./app/middlewares/errorHandler');
const { generalLimiter } = require('./app/middlewares/rateLimit');
const { cacheMiddleware } = require('./app/middlewares/cache');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Apply global rate limiting and caching
app.use(generalLimiter);
app.use(cacheMiddleware);

connectDB();

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
