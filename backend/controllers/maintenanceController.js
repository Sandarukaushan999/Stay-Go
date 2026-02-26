const MaintenanceTicket = require('../models/MaintenanceTicket');

// @desc  List maintenance tickets
// @route GET /api/maintenance
const listTickets = async (req, res) => {
  try {
    const filter =
      req.user.role === 'student' ? { submittedBy: req.user._id } : {};
    const tickets = await MaintenanceTicket.find(filter)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Submit maintenance request
// @route POST /api/maintenance
const createTicket = async (req, res) => {
  try {
    const ticket = await MaintenanceTicket.create({
      ...req.body,
      submittedBy: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update ticket (status, assign technician)
// @route PUT /api/maintenance/:id
const updateTicket = async (req, res) => {
  try {
    const ticket = await MaintenanceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const { status, assignedTo, note } = req.body;
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    if (status || note) {
      ticket.timeline.push({
        status: status || ticket.status,
        note: note || '',
        updatedBy: req.user._id,
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listTickets, createTicket, updateTicket };
