const router = require('express').Router();
const { getAllLoans, getLoan, borrowBook, returnBook, getOverdueLoans } = require('../controllers/loanController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllLoans);
router.get('/overdue', protect, adminOnly, getOverdueLoans);
router.get('/:id', protect, getLoan);
router.post('/borrow', protect, borrowBook);
router.put('/:id/return', protect, returnBook);

module.exports = router;
