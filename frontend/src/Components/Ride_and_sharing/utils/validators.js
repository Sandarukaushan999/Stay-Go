import { z } from 'zod';

const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  addressText: z.string().optional().default(''),
});

export const loginSchema = z.object({
  email: z.email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const riderRegistrationSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  contactNumber: z.string().min(6),
  gender: z.string().min(1),
  address: z.string().min(3),
  campusId: z.string().min(1),
  vehicleNumber: z.string().min(2),
  vehicleType: z.string().min(2),
  seatCount: z.coerce.number().min(1).max(6),
  studentId: z.string().min(3),
  hostelLocation: coordinateSchema,
});

export const passengerRegistrationSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  contactNumber: z.string().min(6),
  gender: z.string().min(1),
  address: z.string().min(3),
  campusId: z.string().min(1),
  studentId: z.string().min(3),
  pickupLocation: coordinateSchema,
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().min(6),
});

export const rideRequestSchema = z.object({
  origin: coordinateSchema,
  destination: coordinateSchema,
  campusId: z.string().min(1),
  riderId: z.string().optional(),
  femaleOnly: z.boolean().optional().default(false),
  seatCount: z.coerce.number().min(1).max(4).default(1),
});

export const incidentSchema = z.object({
  tripId: z.string().min(1),
  type: z.string().default('crash'),
  message: z.string().min(3),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  imageUrl: z.string().optional().default(''),
  location: coordinateSchema,
});
