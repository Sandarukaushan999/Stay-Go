const Ticket = require('../models/Ticket');

// ============================================
// HELPER: Generate unique ticket ID
// Format: MT-YYYYMMDD-XXX (e.g., MT-20260325-001)
// ============================================
const generateTicketId = async () => {
  // Get today's date in YYYYMMDD format
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

  // Count how many tickets were created today to get the next number
  const prefix = `MT-${dateStr}`;
  const count = await Ticket.countDocuments({
    ticketId: { $regex: `^${prefix}` }
  });

  // Create the ticket ID with zero-padded number (001, 002, etc.)
  const number = String(count + 1).padStart(3, '0');
  return `${prefix}-${number}`;
};

// ============================================
// CREATE: Student submits a new maintenance ticket
// Only students can use this endpoint
// ============================================
const createTicket = async (req, res) => {
  try {
    const { title, category, priority, hostelBlock, roomNumber, description } = req.body;

    // Generate unique ticket ID
    const ticketId = await generateTicketId();

    // Get file paths if any attachments were uploaded
    const attachments = req.files ? req.files.map(file => file.path) : [];

    // Create the new ticket with all the data
    const ticket = new Ticket({
      ticketId,
      title,
      category,
      priority,
      hostelBlock,
      roomNumber,
      description,
      attachments,
      status: 'submitted',
      submittedBy: req.user.id,
      // Add first entry to status history - ticket was just submitted
      statusHistory: [{
        status: 'submitted',
        changedBy: req.user.id,
        note: 'Ticket submitted by student'
      }]
    });

    // Save ticket to database
    await ticket.save();

    // Send back success response with the created ticket
    res.status(201).json({
      message: 'Ticket submitted successfully!',
      ticket
    });
  } catch (error) {
    // If validation fails or any error occurs, send error message
    res.status(400).json({ message: error.message });
  }
};

// ============================================
// READ: Get tickets for the logged-in student
// Students can only see their own tickets
// ============================================
const getMyTickets = async (req, res) => {
  try {
    // Find all tickets where submittedBy matches the logged-in user
    // Sort by newest first, and populate user names
    const tickets = await Ticket.find({ submittedBy: req.user.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// READ: Get tickets assigned to the logged-in technician
// Technicians can only see tickets assigned to them
// ============================================
const getAssignedTickets = async (req, res) => {
  try {
    // Find tickets where assignedTo matches the logged-in technician
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// READ: Get all tickets in the system (Admin only)
// Admin can see every ticket with optional filters
// ============================================
const getAllTickets = async (req, res) => {
  try {
    // Get filter values from query string (e.g., ?status=submitted&priority=high)
    const { status, priority, category, hostelBlock, search } = req.query;

    // Build the filter object - only add filters that are provided
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (hostelBlock) filter.hostelBlock = hostelBlock;

    // If search text is provided, search in ticket ID, title, or room number
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Get filtered tickets with user info populated
    const tickets = await Ticket.find(filter)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// READ: Get a single ticket by its ID
// Any authenticated user can view, but access is checked in frontend
// ============================================
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name');

    // If ticket not found, send 404 error
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Admin assigns a technician to a ticket
// Changes status from "submitted" to "assigned"
// ============================================
const assignTicket = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Can only assign tickets that are in "submitted" status
    if (ticket.status !== 'submitted') {
      return res.status(400).json({
        message: 'Can only assign tickets that are in "submitted" status'
      });
    }

    // Update the ticket with technician and new status
    ticket.assignedTo = technicianId;
    ticket.status = 'assigned';

    // Add this change to the status history timeline
    ticket.statusHistory.push({
      status: 'assigned',
      changedBy: req.user.id,
      note: 'Technician assigned by admin'
    });

    await ticket.save();

    res.json({ message: 'Technician assigned successfully!', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Admin rejects a ticket
// Must provide a reason for rejection
// ============================================
const rejectTicket = async (req, res) => {
  try {
    const { reason } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Can only reject tickets that are in "submitted" status
    if (ticket.status !== 'submitted') {
      return res.status(400).json({
        message: 'Can only reject tickets that are in "submitted" status'
      });
    }

    // Rejection reason is required
    if (!reason || reason.length < 10) {
      return res.status(400).json({
        message: 'Rejection reason must be at least 10 characters'
      });
    }

    // Update ticket status and save the rejection reason
    ticket.status = 'rejected';
    ticket.rejectionReason = reason;

    ticket.statusHistory.push({
      status: 'rejected',
      changedBy: req.user.id,
      note: reason
    });

    await ticket.save();

    res.json({ message: 'Ticket rejected', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Technician starts working on a ticket
// Changes status from "assigned" to "in_progress"
// ============================================
const startTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Can only start tickets that are assigned to this technician
    if (ticket.status !== 'assigned') {
      return res.status(400).json({
        message: 'Can only start tickets that are in "assigned" status'
      });
    }

    ticket.status = 'in_progress';

    ticket.statusHistory.push({
      status: 'in_progress',
      changedBy: req.user.id,
      note: 'Technician started working on the issue'
    });

    await ticket.save();

    res.json({ message: 'Ticket is now in progress', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Technician marks ticket as resolved
// Must provide a note about what was done to fix the issue
// ============================================
const resolveTicket = async (req, res) => {
  try {
    const { resolutionNote } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Can only resolve tickets that are in progress
    if (ticket.status !== 'in_progress') {
      return res.status(400).json({
        message: 'Can only resolve tickets that are in "in progress" status'
      });
    }

    // Resolution note is required - technician must explain what they did
    if (!resolutionNote || resolutionNote.length < 10) {
      return res.status(400).json({
        message: 'Resolution note must be at least 10 characters'
      });
    }

    ticket.status = 'resolved';
    ticket.resolutionNote = resolutionNote;

    ticket.statusHistory.push({
      status: 'resolved',
      changedBy: req.user.id,
      note: resolutionNote
    });

    await ticket.save();

    res.json({ message: 'Ticket resolved!', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// UPDATE: Student rates the resolved ticket
// After rating, ticket status changes to "closed"
// ============================================
const rateTicket = async (req, res) => {
  try {
    const { rating, ratingFeedback } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Can only rate tickets that are resolved
    if (ticket.status !== 'resolved') {
      return res.status(400).json({
        message: 'Can only rate tickets that are in "resolved" status'
      });
    }

    // Only the student who submitted the ticket can rate it
    if (ticket.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Only the student who submitted this ticket can rate it'
      });
    }

    // Rating must be between 1 and 5
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    ticket.status = 'closed';
    ticket.rating = rating;
    ticket.ratingFeedback = ratingFeedback || null;

    ticket.statusHistory.push({
      status: 'closed',
      changedBy: req.user.id,
      note: `Student rated ${rating}/5${ratingFeedback ? ': ' + ratingFeedback : ''}`
    });

    await ticket.save();

    res.json({ message: 'Thank you for your feedback! Ticket is now closed.', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// ANALYTICS: Get maintenance statistics for admin dashboard
// Returns counts, averages, and breakdowns for charts
// ============================================
const getAnalytics = async (req, res) => {
  try {
    // Get total count of all tickets
    const totalTickets = await Ticket.countDocuments();

    // Count tickets that are not closed or rejected (open tickets)
    const openTickets = await Ticket.countDocuments({
      status: { $nin: ['closed', 'rejected'] }
    });

    // Count tickets by each status for the bar chart
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Count tickets by each priority for the donut chart
    const priorityCounts = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Count tickets by hostel block for the bar chart
    const blockCounts = await Ticket.aggregate([
      { $group: { _id: '$hostelBlock', count: { $sum: 1 } } }
    ]);

    // Calculate average rating from closed tickets
    const avgRating = await Ticket.aggregate([
      { $match: { rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Send all analytics data back as one response
    res.json({
      totalTickets,
      openTickets,
      avgRating: avgRating[0]?.avgRating?.toFixed(1) || '0.0',
      statusCounts,
      priorityCounts,
      blockCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  getAnalytics
};
