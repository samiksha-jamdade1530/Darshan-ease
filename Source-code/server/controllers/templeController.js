const Temple = require('../models/Temple');

// @desc    Get all active temples
// @route   GET /api/temples
// @access  Public
const getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ isActive: true }).populate('organizer', 'name email');
    res.json(temples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get temple by ID
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('organizer', 'name email');
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new temple
// @route   POST /api/temples
// @access  Private/ORGANIZER, ADMIN
const createTemple = async (req, res) => {
  try {
    const { templeName, location, description, imageUrl, darshanStartTime, darshanEndTime } = req.body;
    const temple = await Temple.create({
      templeName,
      location,
      description,
      imageUrl,
      darshanStartTime,
      darshanEndTime,
      organizer: req.user._id,
    });
    res.status(201).json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
// @access  Private/ORGANIZER, ADMIN
const updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });

    // Only the organizer who owns it or admin can update
    if (temple.organizer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this temple' });
    }

    const updated = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete temple
// @route   DELETE /api/temples/:id
// @access  Private/ADMIN
const deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json({ message: 'Temple deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get temples managed by logged-in organizer
// @route   GET /api/temples/my-temples
// @access  Private/ORGANIZER
const getMyTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id });
    res.json(temples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTemples, getTempleById, createTemple, updateTemple, deleteTemple, getMyTemples };
