const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'caslibrarysecret');
    req.member = await Member.findById(decoded.id).select('-password');
    if (!req.member) return res.status(401).json({ message: 'Member not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.member.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  next();
};
