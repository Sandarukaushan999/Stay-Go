const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc  List all users
// @route GET /api/admin/users
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update user role or status
// @route PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { role, isActive, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, isVerified },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  List all complaints
// @route GET /api/admin/complaints
const listComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email')
      .populate('against', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update complaint status
// @route PUT /api/admin/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNote: req.body.adminNote },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listUsers, updateUser, listComplaints, updateComplaint };
