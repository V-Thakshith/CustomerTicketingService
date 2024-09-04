const Message = require('../models/Message');
const Ticket = require('../models/Ticket');

// Send a message related to a ticket
exports.sendMessage = async (req, res) => {
  try {
    const { ticketId, content } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    const message = new Message({
      content,
      ticketId,
      sender: req.user._id,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Get all messages for a specific ticket
exports.getMessagesForTicket = async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId }).populate('sender');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};
