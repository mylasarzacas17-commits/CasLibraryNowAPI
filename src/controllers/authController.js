const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'caslibrarysecret', { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const member = await Member.create({ name, email, password, phone, address });
    res.status(201).json({ token: generateToken(member._id), member: { id: member._id, name: member.name, email: member.email, membershipId: member.membershipId, role: member.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });
    if (!member || !(await member.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(member._id), member: { id: member._id, name: member.name, email: member.email, membershipId: member.membershipId, role: member.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.member);
};
