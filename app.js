const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./app/config/db');
const routes = require('./app/routes/index.js');
const { errorHandler, ApiError } = require('./app/middleware/error.middleware');

const app = express();

// Connect to Database
connectDB();

// 1) GLOBAL MIDDLEWARES
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body

// 2) ROUTES
app.use('/api/v1', routes);

// Handle undefined routes
app.all('*path', (req, res, next) => {
    next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// 3) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
