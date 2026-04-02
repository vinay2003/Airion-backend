import { z } from 'zod';

export const BusinessAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const BusinessHoursSchema = z.record(z.string(), z.object({
  open: z.string(),
  close: z.string(),
})).optional();

export const SocialLinksSchema = z.object({
  facebook: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
}).optional();

export const CreateVendorSchema = z.object({
  businessName: z.string().min(2),
  businessEmail: z.string().email().optional().nullable(),
  businessPhone: z.string(),
  city: z.string().optional().nullable(),
  yearsInBusiness: z.string().optional().nullable(),
  gstNumber: z.string().optional().nullable(),
  acquisitionChannels: z.array(z.string()).optional(),
  monthlyEventVolume: z.string().optional(),
  averageBookingPrice: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  businessAddress: BusinessAddressSchema,
  businessDescription: z.string().min(10).max(2000),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().optional(),
  businessHours: BusinessHoursSchema,
  portfolioImages: z.array(z.string()).optional(),
  socialLinks: SocialLinksSchema,
});

export const VendorSchema = CreateVendorSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  isVerified: z.boolean().default(false),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateVendorDto = z.infer<typeof CreateVendorSchema>;
export type Vendor = z.infer<typeof VendorSchema>;
