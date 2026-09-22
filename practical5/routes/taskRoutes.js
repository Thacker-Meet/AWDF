const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const validateTask = require('../middleware/validateTask');
const validateTaskId = require('../middleware/validateTaskId');

// Helper function to handle Mongoose validation errors
const handleValidationError = (err, res) => {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: details
    });
  }
  return res.status(500).json({ error: 'Internal server error' });
};

// 1. GET /tasks - Get all tasks from MongoDB
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// 2. GET /tasks/error-test - Simulated route to trigger the global error handler
router.get('/error-test', (req, res, next) => {
  next(new Error('This is a simulated internal server error!'));
});

// 3. GET /tasks/:id - Get a task by its ID (returns 404 JSON response if task does not exist)
router.get('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// 4. POST /tasks - Create a new task in MongoDB
router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json(newTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return handleValidationError(err, res);
    }
    next(err);
  }
});

// 5. PUT /tasks/:id - Update an existing task in MongoDB
router.put('/:id', validateTaskId, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const updateData = {
      title: typeof title === 'string' ? title.trim() : title,
      description,
      completed,
      priority
    };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return handleValidationError(err, res);
    }
    next(err);
  }
});

// 6. DELETE /tasks/:id - Delete a task from MongoDB
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
