const Member = require('../models/Member');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select('-password').populate('activeLoans');
    res.json({ count: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password').populate('activeLoans');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;
    const member = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
