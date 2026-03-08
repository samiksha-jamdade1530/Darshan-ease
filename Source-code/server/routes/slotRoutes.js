const express = require('express');
const router = express.Router();
const {
  getSlotsByTemple, getMySlots, createSlot, updateSlot, deleteSlot, getAllSlots
} = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('ADMIN'), getAllSlots);
router.get('/my-slots', protect, authorize('ORGANIZER', 'ADMIN'), getMySlots);
router.get('/temple/:templeId', getSlotsByTemple);
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createSlot);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), updateSlot);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteSlot);

module.exports = router;
