const User = require('../models/User');
const Temple = require('../models/Temple');
const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/ADMIN
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'USER' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all organizers
// @route   GET /api/admin/organizers
// @access  Private/ADMIN
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'ORGANIZER' }).select('-password');
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/ADMIN
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/ADMIN
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dashboard stats
// @route   GET /api/admin/stats
// @access  Private/ADMIN
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalOrganizers = await User.countDocuments({ role: 'ORGANIZER' });
    const totalTemples = await Temple.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'CONFIRMED' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'CANCELLED' });

    const revenueData = await Booking.aggregate([
      { $match: { bookingStatus: 'CONFIRMED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalOrganizers,
      totalTemples,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllOrganizers, toggleUserStatus, deleteUser, getDashboardStats };
