const express = require('express');
const userController = require('../controller/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/', restrictTo('SuperAdmin', 'Admin'), userController.getAllUsers);
router.patch('/:id/role', restrictTo('SuperAdmin'), userController.updateRole);
router.patch('/:id/status', restrictTo('SuperAdmin', 'Admin'), userController.updateStatus);

module.exports = router;
