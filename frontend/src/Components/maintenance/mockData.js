// ============================================
// MOCK DATA for Maintenance Module
// This file provides fake data for testing the UI before backend is connected
// Once backend API is ready, we will replace this with real API calls
// ============================================

// Mock users - these represent different user roles in the system
export const mockUsers = {
  student: { id: 'student1', name: 'Kasun Perera', email: 'kasun@university.edu', role: 'student' },
  technician1: { id: 'tech1', name: 'Nimal Silva', email: 'nimal@university.edu', role: 'staff' },
  technician2: { id: 'tech2', name: 'Ruwan Fernando', email: 'ruwan@university.edu', role: 'staff' },
  technician3: { id: 'tech3', name: 'Chaminda Jayasinghe', email: 'chaminda@university.edu', role: 'staff' },
  admin: { id: 'admin1', name: 'Sarah M.D.', email: 'sarah@university.edu', role: 'admin' },
}

// List of technicians for the admin to assign from
export const mockTechnicians = [
  mockUsers.technician1,
  mockUsers.technician2,
  mockUsers.technician3,
]

// Mock tickets - sample maintenance tickets with different statuses
export const mockTickets = [
  {
    _id: '1',
    ticketId: 'MT-20260320-001',
    title: 'Broken tap in bathroom',
    category: 'plumbing',
    priority: 'high',
    hostelBlock: 'A',
    roomNumber: '204',
    description: 'The hot water tap in the shared bathroom on the second floor is leaking badly. Water is dripping continuously and the floor is getting wet which is dangerous.',
    attachments: [],
    status: 'submitted',
    submittedBy: mockUsers.student,
    assignedTo: null,
    rejectionReason: null,
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-20T08:30:00', note: 'Ticket submitted by student' }
    ],
    createdAt: '2026-03-20T08:30:00',
  },
  {
    _id: '2',
    ticketId: 'MT-20260319-003',
    title: 'Power socket not working in room',
    category: 'electrical',
    priority: 'medium',
    hostelBlock: 'B',
    roomNumber: '312',
    description: 'The power socket near the study desk stopped working since yesterday. I cannot charge my laptop or use the desk lamp. Other sockets in the room are working fine.',
    attachments: [],
    status: 'assigned',
    submittedBy: mockUsers.student,
    assignedTo: mockUsers.technician1,
    rejectionReason: null,
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-19T14:20:00', note: 'Ticket submitted by student' },
      { status: 'assigned', changedBy: mockUsers.admin, changedAt: '2026-03-19T16:45:00', note: 'Technician assigned by admin' }
    ],
    createdAt: '2026-03-19T14:20:00',
  },
  {
    _id: '3',
    ticketId: 'MT-20260318-002',
    title: 'WiFi connection dropping frequently',
    category: 'network',
    priority: 'high',
    hostelBlock: 'A',
    roomNumber: '105',
    description: 'The WiFi keeps disconnecting every few minutes in my room. It started after the weekend and multiple students on this floor are facing the same issue.',
    attachments: [],
    status: 'in_progress',
    submittedBy: mockUsers.student,
    assignedTo: mockUsers.technician2,
    rejectionReason: null,
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-18T09:10:00', note: 'Ticket submitted by student' },
      { status: 'assigned', changedBy: mockUsers.admin, changedAt: '2026-03-18T10:30:00', note: 'Technician assigned by admin' },
      { status: 'in_progress', changedBy: mockUsers.technician2, changedAt: '2026-03-18T13:00:00', note: 'Technician started working on the issue' }
    ],
    createdAt: '2026-03-18T09:10:00',
  },
  {
    _id: '4',
    ticketId: 'MT-20260317-001',
    title: 'Broken chair in study room',
    category: 'furniture',
    priority: 'low',
    hostelBlock: 'C',
    roomNumber: '401',
    description: 'One of the chairs in the common study room has a broken leg and is unstable. Someone might fall and get hurt if they try to sit on it.',
    attachments: [],
    status: 'resolved',
    submittedBy: mockUsers.student,
    assignedTo: mockUsers.technician3,
    rejectionReason: null,
    resolutionNote: 'Replaced the broken chair leg with a new one. Chair is now stable and safe to use.',
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-17T07:45:00', note: 'Ticket submitted by student' },
      { status: 'assigned', changedBy: mockUsers.admin, changedAt: '2026-03-17T09:00:00', note: 'Technician assigned by admin' },
      { status: 'in_progress', changedBy: mockUsers.technician3, changedAt: '2026-03-17T10:30:00', note: 'Technician started working on the issue' },
      { status: 'resolved', changedBy: mockUsers.technician3, changedAt: '2026-03-17T14:00:00', note: 'Replaced the broken chair leg with a new one. Chair is now stable and safe to use.' }
    ],
    createdAt: '2026-03-17T07:45:00',
  },
  {
    _id: '5',
    ticketId: 'MT-20260315-002',
    title: 'Ceiling fan making loud noise',
    category: 'electrical',
    priority: 'medium',
    hostelBlock: 'D',
    roomNumber: '208',
    description: 'The ceiling fan in my room is making a very loud rattling noise when turned on. It vibrates a lot and I am worried it might fall down. Please check urgently.',
    attachments: [],
    status: 'closed',
    submittedBy: mockUsers.student,
    assignedTo: mockUsers.technician1,
    rejectionReason: null,
    resolutionNote: 'Tightened the fan mounting screws and balanced the blades. Fan is now running smoothly without noise.',
    rating: 4,
    ratingFeedback: 'Good service, fixed quickly. Thank you!',
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-15T11:20:00', note: 'Ticket submitted by student' },
      { status: 'assigned', changedBy: mockUsers.admin, changedAt: '2026-03-15T13:00:00', note: 'Technician assigned by admin' },
      { status: 'in_progress', changedBy: mockUsers.technician1, changedAt: '2026-03-15T14:30:00', note: 'Technician started working on the issue' },
      { status: 'resolved', changedBy: mockUsers.technician1, changedAt: '2026-03-15T16:00:00', note: 'Tightened the fan mounting screws and balanced the blades.' },
      { status: 'closed', changedBy: mockUsers.student, changedAt: '2026-03-16T08:00:00', note: 'Student rated 4/5: Good service, fixed quickly. Thank you!' }
    ],
    createdAt: '2026-03-15T11:20:00',
  },
  {
    _id: '6',
    ticketId: 'MT-20260316-001',
    title: 'Duplicate complaint test',
    category: 'other',
    priority: 'low',
    hostelBlock: 'E',
    roomNumber: '101',
    description: 'This is a test complaint that was submitted by mistake and was rejected by the admin as it was a duplicate of another existing ticket.',
    attachments: [],
    status: 'rejected',
    submittedBy: mockUsers.student,
    assignedTo: null,
    rejectionReason: 'This is a duplicate of ticket MT-20260315-002. Please check your existing tickets before submitting new ones.',
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-16T09:00:00', note: 'Ticket submitted by student' },
      { status: 'rejected', changedBy: mockUsers.admin, changedAt: '2026-03-16T09:30:00', note: 'This is a duplicate of ticket MT-20260315-002.' }
    ],
    createdAt: '2026-03-16T09:00:00',
  },
  {
    _id: '7',
    ticketId: 'MT-20260322-001',
    title: 'Water heater not heating',
    category: 'plumbing',
    priority: 'emergency',
    hostelBlock: 'A',
    roomNumber: '301',
    description: 'The water heater in the bathroom is not working at all. No hot water is coming out even after waiting for a long time. Many students need hot water for bathing.',
    attachments: [],
    status: 'submitted',
    submittedBy: mockUsers.student,
    assignedTo: null,
    rejectionReason: null,
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-22T06:15:00', note: 'Ticket submitted by student' }
    ],
    createdAt: '2026-03-22T06:15:00',
  },
  {
    _id: '8',
    ticketId: 'MT-20260321-001',
    title: 'Common area floor needs cleaning',
    category: 'cleaning',
    priority: 'low',
    hostelBlock: 'B',
    roomNumber: '000',
    description: 'The common area floor on the ground floor is very dirty and has not been cleaned for the past few days. It looks bad and smells unpleasant for visitors.',
    attachments: [],
    status: 'assigned',
    submittedBy: mockUsers.student,
    assignedTo: mockUsers.technician2,
    rejectionReason: null,
    resolutionNote: null,
    rating: null,
    ratingFeedback: null,
    statusHistory: [
      { status: 'submitted', changedBy: mockUsers.student, changedAt: '2026-03-21T10:00:00', note: 'Ticket submitted by student' },
      { status: 'assigned', changedBy: mockUsers.admin, changedAt: '2026-03-21T11:30:00', note: 'Technician assigned by admin' }
    ],
    createdAt: '2026-03-21T10:00:00',
  },
]

// Mock announcements - sample admin announcements
export const mockAnnouncements = [
  {
    _id: 'a1',
    title: 'Scheduled water supply maintenance - Block A & B',
    content: 'Water supply will be temporarily cut off on Block A and Block B on 28th March from 8:00 AM to 12:00 PM for pipe maintenance work. Please store enough water before that time. We apologize for any inconvenience caused.',
    priority: 'urgent',
    isActive: true,
    createdBy: mockUsers.admin,
    createdAt: '2026-03-25T09:00:00',
  },
  {
    _id: 'a2',
    title: 'New maintenance request process update',
    content: 'From now on all maintenance requests should be submitted through the STAY & GO platform only. Phone calls and informal messages will not be accepted as official requests. This will help us track and resolve issues faster.',
    priority: 'important',
    isActive: true,
    createdBy: mockUsers.admin,
    createdAt: '2026-03-24T14:30:00',
  },
  {
    _id: 'a3',
    title: 'Monthly pest control schedule',
    content: 'Regular pest control treatment will be carried out in all hostel blocks during the first week of April. Students are requested to keep their rooms tidy and remove any food items from open surfaces before the treatment.',
    priority: 'normal',
    isActive: true,
    createdBy: mockUsers.admin,
    createdAt: '2026-03-23T11:00:00',
  },
]
