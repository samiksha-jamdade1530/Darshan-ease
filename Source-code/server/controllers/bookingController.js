const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Temple = require('../models/Temple');

// ================================
// CREATE BOOKING
// ================================

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/USER

const createBooking = async (req, res) => {
  try {
    const { slotId, templeId, numberOfDevotees } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.availableSeats < numberOfDevotees) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    const totalAmount = slot.price * numberOfDevotees;

    const booking = await Booking.create({
      user: req.user._id,
      slot: slotId,
      temple: templeId,
      numberOfDevotees,
      totalAmount,
    });

    // Reduce available seats
    slot.availableSeats -= numberOfDevotees;
    await slot.save();

    const populated = await Booking.findById(booking._id)
      .populate('slot')
      .populate('temple', 'templeName location');

    res.status(201).json(populated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// ================================
// GET MY BOOKINGS
// ================================

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/USER

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot')
      .populate('temple', 'templeName location imageUrl')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================================
// CANCEL BOOKING
// ================================

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private/USER

const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'CANCELLED';
    await booking.save();

    // Restore seats
    const slot = await Slot.findById(booking.slot);

    if (slot) {
      slot.availableSeats += booking.numberOfDevotees;
      await slot.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================================
// ORGANIZER BOOKINGS
// ================================

// @desc    Get bookings for organizer temples
// @route   GET /api/bookings/organizer
// @access  Private/ORGANIZER

const getOrganizerBookings = async (req, res) => {
  try {

    const temples = await Temple.find({
      organizer: req.user._id,
    }).select('_id');

    const templeIds = temples.map((t) => t._id);

    const bookings = await Booking.find({
      temple: { $in: templeIds },
    })
      .populate('user', 'name email phone')
      .populate('slot')
      .populate('temple', 'templeName')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================================
// ADMIN BOOKINGS
// ================================

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/ADMIN

const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('slot')
      .populate('temple', 'templeName location')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
  getAllBookings,
};