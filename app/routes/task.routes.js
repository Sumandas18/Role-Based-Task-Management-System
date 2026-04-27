const express = require('express');
const taskController = require('../controller/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect); // All task routes require authentication

router
    .route('/')
    .post(restrictTo('SuperAdmin', 'Admin', 'Manager'), taskController.createTask)
    .get(taskController.getTasks);

router
    .route('/:id')
    .get(taskController.getTaskById)
    .patch(taskController.updateTask)
    .delete(restrictTo('SuperAdmin', 'Admin', 'Manager'), taskController.deleteTask);

module.exports = router;
