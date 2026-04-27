const express = require('express');
const authController = require('../controller/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);

module.exports = router;
