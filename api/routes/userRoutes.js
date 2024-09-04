const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserDetails } = require('../controllers/userController');

router.get('/me', authMiddleware, getUserDetails);

module.exports = router;
