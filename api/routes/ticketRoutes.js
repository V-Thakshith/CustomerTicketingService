const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//adding /tickets to view tickets
router.get('/tickets', ticketController.getAllTickets);

router.post('/', authMiddleware, ticketController.createTicket);
router.get('/:id', authMiddleware, ticketController.getTicket);
router.put('/:id/status', authMiddleware, roleMiddleware(['Agent', 'Manager']), ticketController.updateTicketStatus);
router.post('/:id/assign', authMiddleware, roleMiddleware(['Manager']), ticketController.assignTicket);
router.get('/assigned', authMiddleware, roleMiddleware(['Agent']), ticketController.getAssignedTickets);
router.get('/customer/:customerId', authMiddleware, ticketController.getTicketsByCustomer);

module.exports = router;
