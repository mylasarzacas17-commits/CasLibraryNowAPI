const router = require('express').Router();
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
