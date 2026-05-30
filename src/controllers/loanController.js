const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member');

const FINE_PER_DAY = 5; // PHP 5 per day overdue

exports.getAllLoans = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    const loans = await Loan.find(filter).populate('book', 'title author isbn').populate('member', 'name email membershipId');
    res.json({ count: loans.length, loans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('book').populate('member', '-password');
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (!member.isActive) return res.status(400).json({ message: 'Member account is inactive' });

    const due = dueDate ? new Date(dueDate) : (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d; })();
    const loan = await Loan.create({ book: bookId, member: memberId, dueDate: due });

    book.availableCopies -= 1;
    await book.save();

    member.activeLoans.push(loan._id);
    await member.save();

    res.status(201).json({ message: 'Book borrowed successfully', loan: await loan.populate('book', 'title author isbn') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    const now = new Date();
    loan.returnedAt = now;
    loan.status = 'returned';

    // Calculate fine if overdue
    if (now > loan.dueDate) {
      const daysOverdue = Math.ceil((now - loan.dueDate) / (1000 * 60 * 60 * 24));
      loan.fine = daysOverdue * FINE_PER_DAY;
    }
    await loan.save();

    // Restore book copy
    await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });

    // Remove from member's activeLoans
    await Member.findByIdAndUpdate(loan.member, { $pull: { activeLoans: loan._id } });

    res.json({ message: 'Book returned successfully', fine: loan.fine, loan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOverdueLoans = async (req, res) => {
  try {
    const now = new Date();
    const overdueLoans = await Loan.find({ dueDate: { $lt: now }, status: 'active' })
      .populate('book', 'title author isbn')
      .populate('member', 'name email membershipId');

    // Update status to overdue
    await Loan.updateMany({ dueDate: { $lt: now }, status: 'active' }, { status: 'overdue' });

    res.json({ count: overdueLoans.length, overdueLoans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
