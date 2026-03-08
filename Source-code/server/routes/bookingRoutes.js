const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, cancelBooking, getOrganizerBookings, getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('USER'), createBooking);
router.get('/my-bookings', protect, authorize('USER'), getMyBookings);
router.put('/:id/cancel', protect, authorize('USER'), cancelBooking);
router.get('/organizer', protect, authorize('ORGANIZER'), getOrganizerBookings);
router.get('/', protect, authorize('ADMIN'), getAllBookings);

module.exports = router;
