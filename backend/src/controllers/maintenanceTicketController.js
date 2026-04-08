const Ticket = require('../models/Ticket');
const { ROLES } = require('../constants/roles');

// ============================================
// MAINTENANCE TICKET CONTROLLER
// All controller functions for tickets
// Uses team's auth pattern: req.user is the full User object (set by requireAuth middleware)
// All errors are thrown - asyncHandler in routes catches them
// ============================================

// ---- HELPER: Generate unique ticket ID ----
// Format: MT-YYYYMMDD-XXX (e.g., MT-20260325-001)
async function generateTicketId() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  const prefix = `MT-${dateStr}`;

  // Count tickets created today to get the next number
  const count = await Ticket.countDocuments({
    ticketId: { $regex: `^${prefix}` },
  });

  const number = String(count + 1).padStart(3, '0');
  return `${prefix}-${number}`;
}

// ============================================
// CREATE: Student submits a new ticket
// Any authenticated user can submit (since all university users live in hostels)
// ============================================
async function createTicket(req, res) {
  const { title, category, priority, hostelBlock, roomNumber, description } = req.body;

  // Generate unique ticket ID
  const ticketId = await generateTicketId();

  // Get file paths if any attachments were uploaded
  const attachments = req.files ? req.files.map((file) => file.path) : [];

  // Create the new ticket
  const ticket = await Ticket.create({
    ticketId,
    title,
    category,
    priority,
    hostelBlock,
    roomNumber,
    description,
    attachments,
    status: 'submitted',
    submittedBy: req.user._id,
    statusHistory: [
      {
        status: 'submitted',
        changedBy: req.user._id,
        note: 'Ticket submitted by student',
      },
    ],
  });

  return res.status(201).json({
    message: 'Ticket submitted successfully!',
    ticket,
  });
}

// ============================================
// READ: Get tickets for the logged-in user
// Returns only tickets where submittedBy = current user
// ============================================
async function getMyTickets(req, res) {
  const tickets = await Ticket.find({ submittedBy: req.user._id })
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });

  return res.json(tickets);
}

// ============================================
// READ: Get tickets assigned to the logged-in technician
// Only users with role='staff' can use this endpoint
// ============================================
async function getAssignedTickets(req, res) {
  const tickets = await Ticket.find({ assignedTo: req.user._id })
    .populate('submittedBy', 'name email role')
    .sort({ createdAt: -1 });

  return res.json(tickets);
}

// ============================================
// READ: Get all tickets (Admin only)
// Supports query filters: status, priority, category, hostelBlock, search
// ============================================
async function getAllTickets(req, res) {
  const { status, priority, category, hostelBlock, search } = req.query;

  // Build the filter object - only include filters that are provided
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (hostelBlock) filter.hostelBlock = hostelBlock;

  // If search is provided, search in ticket ID, title, or room number
  if (search) {
    filter.$or = [
      { ticketId: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { roomNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const tickets = await Ticket.find(filter)
    .populate('submittedBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });

  return res.json(tickets);
}

// ============================================
// READ: Get a single ticket by its ID
// Any authenticated user can call this (frontend checks access)
// ============================================
async function getTicketById(req, res) {
  const ticket = await Ticket.findById(req.params.id)
    .populate('submittedBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('statusHistory.changedBy', 'name role');

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  return res.json(ticket);
}

// ============================================
// UPDATE: Admin assigns a technician to a ticket
// Changes status from "submitted" to "assigned"
// ============================================
async function assignTicket(req, res) {
  const { technicianId } = req.body;

  if (!technicianId) {
    return res.status(400).json({ message: 'Technician ID is required' });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  // Can only assign tickets that are in "submitted" status
  if (ticket.status !== 'submitted') {
    return res.status(400).json({
      message: 'Can only assign tickets that are in "submitted" status',
    });
  }

  // Update the ticket
  ticket.assignedTo = technicianId;
  ticket.status = 'assigned';
  ticket.statusHistory.push({
    status: 'assigned',
    changedBy: req.user._id,
    note: 'Technician assigned by admin',
  });

  await ticket.save();

  return res.json({ message: 'Technician assigned successfully!', ticket });
}

// ============================================
// UPDATE: Admin rejects a ticket
// Must provide a reason (minimum 10 characters)
// ============================================
async function rejectTicket(req, res) {
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return res.status(400).json({
      message: 'Rejection reason must be at least 10 characters',
    });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  if (ticket.status !== 'submitted') {
    return res.status(400).json({
      message: 'Can only reject tickets that are in "submitted" status',
    });
  }

  ticket.status = 'rejected';
  ticket.rejectionReason = reason.trim();
  ticket.statusHistory.push({
    status: 'rejected',
    changedBy: req.user._id,
    note: reason.trim(),
  });

  await ticket.save();

  return res.json({ message: 'Ticket rejected', ticket });
}

// ============================================
// UPDATE: Technician starts working on a ticket
// Changes status from "assigned" to "in_progress"
// ============================================
async function startTicket(req, res) {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  // Can only start tickets in "assigned" status
  if (ticket.status !== 'assigned') {
    return res.status(400).json({
      message: 'Can only start tickets that are in "assigned" status',
    });
  }

  // Verify this technician is the one assigned
  if (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not assigned to this ticket' });
  }

  ticket.status = 'in_progress';
  ticket.statusHistory.push({
    status: 'in_progress',
    changedBy: req.user._id,
    note: 'Technician started working on the issue',
  });

  await ticket.save();

  return res.json({ message: 'Ticket is now in progress', ticket });
}

// ============================================
// UPDATE: Technician marks ticket as resolved
// Must provide a resolution note (minimum 10 characters)
// ============================================
async function resolveTicket(req, res) {
  const { resolutionNote } = req.body;

  if (!resolutionNote || resolutionNote.trim().length < 10) {
    return res.status(400).json({
      message: 'Resolution note must be at least 10 characters',
    });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  if (ticket.status !== 'in_progress') {
    return res.status(400).json({
      message: 'Can only resolve tickets that are in "in progress" status',
    });
  }

  // Verify this technician is the one assigned
  if (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not assigned to this ticket' });
  }

  ticket.status = 'resolved';
  ticket.resolutionNote = resolutionNote.trim();
  ticket.statusHistory.push({
    status: 'resolved',
    changedBy: req.user._id,
    note: resolutionNote.trim(),
  });

  await ticket.save();

  return res.json({ message: 'Ticket resolved!', ticket });
}

// ============================================
// UPDATE: Student rates the resolved ticket
// After rating, ticket status changes to "closed"
// ============================================
async function rateTicket(req, res) {
  const { rating, ratingFeedback } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: 'Rating must be between 1 and 5',
    });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  if (ticket.status !== 'resolved') {
    return res.status(400).json({
      message: 'Can only rate tickets that are in "resolved" status',
    });
  }

  // Only the student who submitted can rate
  if (ticket.submittedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: 'Only the student who submitted this ticket can rate it',
    });
  }

  ticket.status = 'closed';
  ticket.rating = Number(rating);
  ticket.ratingFeedback = ratingFeedback || null;
  ticket.statusHistory.push({
    status: 'closed',
    changedBy: req.user._id,
    note: `Student rated ${rating}/5${ratingFeedback ? ': ' + ratingFeedback : ''}`,
  });

  await ticket.save();

  return res.json({
    message: 'Thank you for your feedback! Ticket is now closed.',
    ticket,
  });
}

// ============================================
// READ: Get analytics data for admin dashboard
// Returns counts and breakdowns for all the charts
// ============================================
async function getAnalytics(req, res) {
  const totalTickets = await Ticket.countDocuments();

  const openTickets = await Ticket.countDocuments({
    status: { $nin: ['closed', 'rejected'] },
  });

  // Count tickets by each status
  const statusCounts = await Ticket.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Count tickets by each priority
  const priorityCounts = await Ticket.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  // Count tickets by each hostel block
  const blockCounts = await Ticket.aggregate([
    { $group: { _id: '$hostelBlock', count: { $sum: 1 } } },
  ]);

  // Calculate average rating
  const avgRatingResult = await Ticket.aggregate([
    { $match: { rating: { $ne: null } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);

  return res.json({
    totalTickets,
    openTickets,
    avgRating: avgRatingResult[0]?.avgRating?.toFixed(1) || '0.0',
    statusCounts,
    priorityCounts,
    blockCounts,
  });
}

// ============================================
// READ: Get list of all technicians (staff role)
// Used by admin when assigning technicians to tickets
// ============================================
async function getTechnicians(req, res) {
  const User = require('../models/User');
  const technicians = await User.find({ role: ROLES.STAFF }).select('name email role');
  return res.json(technicians);
}

module.exports = {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  getTicketById,
  assignTicket,
  rejectTicket,
  startTicket,
  resolveTicket,
  rateTicket,
  getAnalytics,
  getTechnicians,
};
