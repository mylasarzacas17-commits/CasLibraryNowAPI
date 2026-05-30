const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  borrowedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedAt: { type: Date },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  fine: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-set due date 14 days from borrow
loanSchema.pre('save', function (next) {
  if (!this.dueDate) {
    const due = new Date(this.borrowedAt);
    due.setDate(due.getDate() + 14);
    this.dueDate = due;
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
