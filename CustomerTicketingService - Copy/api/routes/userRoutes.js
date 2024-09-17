const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserDetails } = require('../controllers/userController');
const { getAllAgentsDetails } = require('../controllers/managerController');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/me', authMiddleware, getUserDetails);
router.get('/allAgentsDetails', authMiddleware,roleMiddleware(['manager']), getAllAgentsDetails);

module.exports = router;
