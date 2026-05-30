const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  address: { type: String },
  membershipId: { type: String, unique: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  isActive: { type: Boolean, default: true },
  activeLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
}, { timestamps: true });

// Hash password before saving
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  // Auto-generate membership ID
  if (!this.membershipId) {
    this.membershipId = 'MEM-' + Date.now();
  }
  next();
});

memberSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Member', memberSchema);
