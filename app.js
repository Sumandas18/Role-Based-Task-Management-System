const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./app/config/db');
const routes = require('./app/routes/index.js');
const { errorHandler, ApiError } = require('./app/middleware/error.middleware');

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.all('*path', (req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
