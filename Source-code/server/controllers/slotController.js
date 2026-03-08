const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc    Get all slots for a temple
// @route   GET /api/slots/temple/:templeId
// @access  Public
const Slot = require('../models/Slot');

const getSlotsByTemple = async (req, res) => {
  try {
    const templeId = req.params.templeId;

    const slots = await Slot.find({ temple: templeId }).sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
};
// @desc    Get all slots (organizer's temples)
// @route   GET /api/slots/my-slots
// @access  Private/ORGANIZER
const getMySlots = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id }).select('_id');
    const templeIds = temples.map((t) => t._id);
    const slots = await DarshanSlot.find({ temple: { $in: templeIds } })
      .populate('temple', 'templeName location')
      .sort({ date: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create darshan slot
// @route   POST /api/slots
// @access  Private/ORGANIZER, ADMIN
const createSlot = async (req, res) => {
  try {
    const { temple, date, startTime, endTime, totalSeats, price, poojaType } = req.body;

    const slot = await DarshanSlot.create({
      temple,
      date,
      startTime,
      endTime,
      totalSeats,
      availableSeats: totalSeats,
      price,
      poojaType,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update darshan slot
// @route   PUT /api/slots/:id
// @access  Private/ORGANIZER, ADMIN
const updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete darshan slot
// @route   DELETE /api/slots/:id
// @access  Private/ORGANIZER, ADMIN
const deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all slots (admin)
// @route   GET /api/slots
// @access  Private/ADMIN
const getAllSlots = async (req, res) => {
  try {
    const slots = await DarshanSlot.find()
      .populate('temple', 'templeName location')
      .sort({ date: -1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSlotsByTemple, getMySlots, createSlot, updateSlot, deleteSlot, getAllSlots };
