const router = require('express').Router();
const { getAllMembers, getMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllMembers);
router.get('/:id', protect, getMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;
