require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');
const validateContentType = require('./middleware/validateContentType');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// 1. Enable CORS for frontend-backend communication
app.use(cors());

// 2. Parse incoming JSON request bodies (Built-in Express middleware)
app.use(express.json());

// 3. Reject POST/PUT requests without application/json Content-Type
app.use(validateContentType);

// 4. Log details of every incoming request (Custom middleware)
app.use(logger);

// 5. Mount task management REST API routes under the /tasks prefix
app.use('/tasks', taskRoutes);

// 6. Default home route
app.get('/', (req, res) => {
  res.status(200).send('Task Management REST API is running. Access endpoints at /tasks');
});

// 7. Handle 404 Not Found for undefined routes
app.use(notFoundHandler);

// 8. Global Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
