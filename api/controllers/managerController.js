const User = require('../models/User');

/**
 * Get details of all agents.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - JSON response with list of all agents
 */
const getAllAgentsDetails = async (req, res) => {
  try {
    // Find all users with the role of 'agent'
    const agents = await User.find({ role: 'agent' }).select('-password'); // Exclude password from the response

    if (agents.length === 0) {
      return res.status(404).json({ msg: 'No agents found' });
    }

    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllAgentsDetails, 
};
