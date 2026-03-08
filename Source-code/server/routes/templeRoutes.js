const express = require('express');
const router = express.Router();
const {
  getAllTemples, getTempleById, createTemple, updateTemple, deleteTemple, getMyTemples
} = require('../controllers/templeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllTemples);
router.get('/my-temples', protect, authorize('ORGANIZER', 'ADMIN'), getMyTemples);
router.get('/:id', getTempleById);
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createTemple);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), updateTemple);
router.delete('/:id', protect, authorize('ADMIN'), deleteTemple);

module.exports = router;
