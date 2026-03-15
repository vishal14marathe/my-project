const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed'])
  ], validate, createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;