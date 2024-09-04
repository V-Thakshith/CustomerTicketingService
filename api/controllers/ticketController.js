const Ticket = require('../models/Ticket');
const User = require('../models/User');
const mongoose = require('mongoose');
//const { sendSms } = require('../services/twilioService');
const { sendEmail } = require('../services/emailService');

// Send notification to customer
const notifyCustomer = async (ticketId, message) => {
  try {
    const ticket = await Ticket.findById(ticketId).populate('assignedTo');
    if (!ticket) throw new Error('Ticket not found');
    
    const customer = await User.findById(ticket.customer);
    if (!customer) throw new Error('Customer not found');
    
    // Send SMS
    //if (customer.phone) {
    //  await sendSms(customer.phone, message);
    //}
    
    // Send Email
    if (customer.email) {
      await sendEmail(customer.email, 'Ticket Update', message);
    }
  } catch (error) {
    console.error('Error notifying customer:', error);
  }
};

// Example: Update ticket status and notify customer
exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update ticket status
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    // Notify customer
    const message = `Your ticket with ID ${id} has been updated to ${status}.`;
    await notifyCustomer(id, message);

    res.status(200).json({ msg: 'Ticket status updated', ticket });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};


// Create a new ticket and assign it to the least busy agent based on category
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, attachments } = req.body;

    // Validate input
    if (!title || !description || !category) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Create the ticket
    const newTicket = new Ticket({
      title,
      description,
      category,
      status: 'Open',
      attachments,
    });

    // Find the least busy agent for the given category
    const agents = await User.find({ role: 'Agent' }).exec();
    if (agents.length === 0) {
      return res.status(404).json({ msg: 'No agents found' });
    }

    // Count the number of tickets assigned to each agent for the category
    const agentTicketCounts = await Promise.all(
      agents.map(async (agent) => {
        const count = await Ticket.countDocuments({ assignedTo: agent._id, category });
        return { agent, count };
      })
    );

    // Sort agents by ticket count and select the least busy
    const leastBusyAgent = agentTicketCounts.sort((a, b) => a.count - b.count)[0].agent;

    // Assign the ticket to the least busy agent
    newTicket.assignedTo = leastBusyAgent._id;
    await newTicket.save();

    res.status(201).json({ msg: 'Ticket created and assigned', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Retrieve a specific ticket by ID
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy assignedTo');
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Update the status of a ticket

// Assign a ticket to a support agent
exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    // Check if the user is an agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'Agent') return res.status(400).json({ msg: 'Invalid agent' });

    ticket.assignedTo = agentId;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Get all tickets assigned to the authenticated agent
exports.getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

exports.getTicketsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const tickets = await Ticket.find({ customer: customerId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets by customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

