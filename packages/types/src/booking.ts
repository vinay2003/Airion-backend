import { z } from 'zod';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const CreateBookingSchema = z.object({
  userId: z.string().uuid(),
  vendorId: z.string().uuid(),
  serviceId: z.string().uuid(),
  packageId: z.string().uuid(),
  totalAmount: z.number().positive(),
  bookingDate: z.coerce.date(),
  eventDate: z.coerce.date(),
  eventAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
    additionalInfo: z.string().optional(),
  }),
  specialRequirements: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'stripe', 'cash']),
});

export const BookingSchema = CreateBookingSchema.extend({
  id: z.string().uuid(),
  status: z.nativeEnum(BookingStatus).default(BookingStatus.PENDING),
  paymentId: z.string().optional().nullable(),
  paymentStatus: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;
export type Booking = z.infer<typeof BookingSchema>;
