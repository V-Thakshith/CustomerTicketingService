const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log(req.cookies)
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
