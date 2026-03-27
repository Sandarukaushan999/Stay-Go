import { z } from 'zod';

const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  addressText: z.string().optional().default(''),
});

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .refine((value) => !/\s/.test(value), 'Spaces are not allowed in email')
  .refine((value) => value.includes('@'), '@ is required in email')
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Enter a valid email address');

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .refine((value) => !/\s/.test(value), 'Spaces are not allowed in password')
  .min(6, 'Password must be at least 6 characters');

const contactSchema = z
  .string()
  .min(6, 'Contact number must be at least 6 digits')
  .refine((value) => !/\s/.test(value), 'Spaces are not allowed in contact number');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const riderRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  contactNumber: contactSchema,
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(3, 'Address is required'),
  campusId: z.string().min(1, 'Campus is required'),
  vehicleNumber: z.string().min(2, 'Vehicle number is required'),
  vehicleType: z.string().min(2, 'Vehicle type is required'),
  seatCount: z.coerce.number().min(1).max(6),
  studentId: z.string().min(3, 'Student ID is required'),
  hostelLocation: coordinateSchema,
});

export const passengerRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  contactNumber: contactSchema,
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(3, 'Address is required'),
  campusId: z.string().min(1, 'Campus is required'),
  studentId: z.string().min(3, 'Student ID is required'),
  pickupLocation: coordinateSchema,
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: contactSchema,
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