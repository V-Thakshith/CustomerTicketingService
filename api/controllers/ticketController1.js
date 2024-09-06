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
// Create a new ticket and assign it to the least busy agent
  exports.createTicket = async (req, res) => {
    try {
      const { title, description, attachments, customerId } = req.body;

      // Validate input
      if (!title || !description) {
        return res.status(400).json({ msg: 'Missing required fields' });
      }

      const now = new Date(); // Create a Date object with the current time

      // Format the date in a readable format (e.g., "September 5, 2024")
      const readableDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create the ticket
      const newTicket = new Ticket({
        title,
        description,
        status: 'Open',
        attachments,
        customer: customerId,
        createdAt: readableDate
      });

      // Find all agents
      const agents = await User.find({ role: 'agent' }).exec();
      if (agents.length === 0) {
        return res.status(404).json({ msg: 'No agents found' });
      }

      // Check if there are any agents who are not assigned any tasks
      const unassignedAgents = await User.find({
        role: 'agent',
        _id: { $nin: await Ticket.distinct('assignedTo') } // Agents with no tickets
      }).exec();

      if (unassignedAgents.length > 0) {
        // Assign the ticket to an unassigned agent
        newTicket.assignedTo = unassignedAgents[0]._id;
        await newTicket.save();
        return res.status(201).json({ msg: 'Ticket created and assigned to an unassigned agent', ticket: newTicket });
      }

      // Count the number of tickets assigned to each agent
      const agentTicketCounts = await Promise.all(
        agents.map(async (agent) => {
          const count = await Ticket.countDocuments({ assignedTo: agent._id });
          return { agent, count };
        })
      );

      // Sort agents by ticket count and select the least busy
      const leastBusyAgent = agentTicketCounts
        .sort((a, b) => a.count - b.count)[0]?.agent; // Optional chaining in case array is empty

      if (!leastBusyAgent) {
        return res.status(404).json({ msg: 'Could not determine the least busy agent' });
      }

      // Assign the ticket to the least busy agent
      newTicket.assignedTo = leastBusyAgent._id;
      await newTicket.save();

      res.status(201).json({ msg: 'Ticket created and assigned', ticket: newTicket });
    } catch (error) {
      console.error('Error creating ticket:', error);
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
    const { agentId } = req.params;

    // Fetch tickets assigned to the agent and populate customer details
    const tickets = await Ticket.find({ assignedTo: agentId })
                               .populate('customer', 'name email') // Populate customer details
                               .exec();

    // Map the tickets to include customer details in the response
    const result = tickets.map(ticket => ({
      ...ticket._doc, // Include all ticket fields
      customerName: ticket.customer ? ticket.customer.name : 'N/A',
      customerEmail: ticket.customer ? ticket.customer.email : 'N/A'
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};



exports.getTicketsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Fetch tickets for the customer
    const tickets = await Ticket.find({ customer: customerId }).populate('assignedTo');
    
    // Fetch and include agent details in each ticket
    const ticketsWithAgentDetails = await Promise.all(
      tickets.map(async (ticket) => {
        const agentDetails = ticket.assignedTo ? await getAgentDetails(ticket.assignedTo) : null;
        return {
          ...ticket._doc,
          agent: agentDetails
        };
      })
    );
    console.log(ticketsWithAgentDetails)
    res.status(200).json(ticketsWithAgentDetails);
  } catch (error) {
    console.error('Error fetching tickets by customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAgentDetails = async (employeeId) => {
  try {
    const agent = await User.findById(employeeId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return {
      name: agent.name,
      email: agent.email
    };
  } catch (error) {
    console.error('Error fetching agent details:', error);
    throw new Error('Error fetching agent details');
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('customer assignedTo');  // Correct field names for population
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ msg: 'Error fetching tickets', error: error.message });
  }
};