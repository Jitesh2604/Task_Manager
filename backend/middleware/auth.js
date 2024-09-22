const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

// console.log(process.env.JWT_SECRET, 'secret')
const authMiddleware = async(req, res, next) => {
  // console.log('Authorization Header:', req.header('Authorization')); // Log header for debugging

  const token = req.header('Authorization')?.replace('Bearer ', '').trim();
  // console.log(token, 'token')

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded, "decoded")
    const user = await User.findById(decoded.id)
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Error:', err); // Log the error for debugging
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
