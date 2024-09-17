const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user (customer, agent, or manager)
exports.registerUser = async (req, res) => {
  try {
    const { fullName,signupEmail, signupPassword,dob,country,role,gender } = req.body;
    if (!['customer', 'agent', 'manager'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    let user = await User.findOne({ signupEmail });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(signupPassword, 10);

    user = new User({
      name: fullName,
  email: signupEmail,
  password: hashedPassword,
  role: role, 
  gender: gender,
  dob: dob,
  country:country
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)

    // Find user
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    console.log(token,user)
    res.cookie('token',token).json({token,user})
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

exports.logout=async(req,res)=>{
  res.json(true)
}