const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/messages', authMiddleware, communicationController.sendMessage);
router.get('/messages/:ticketId', authMiddleware, communicationController.getMessagesForTicket);

module.exports = router;
