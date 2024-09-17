const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', authController.registerUser);
router.post('/registerManager', authMiddleware, roleMiddleware(['manager']), authController.registerUser);
router.post('/registerAgent', authMiddleware, authController.registerUser); // New route for registering agents
router.post('/login', authController.loginUser);

module.exports = router;
