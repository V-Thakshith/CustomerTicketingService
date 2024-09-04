const User = require('../models/User');

/**
 * Get details of the currently authenticated user.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - JSON response with user details
 */
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated user
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUserDetails,
};
