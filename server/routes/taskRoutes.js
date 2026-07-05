const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Normal routes (No ID needed)
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);

// Routes requiring a specific Task ID
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;