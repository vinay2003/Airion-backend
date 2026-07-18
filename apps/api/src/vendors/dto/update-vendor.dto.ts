import { createZodDto } from 'nestjs-zod';
import { CreateVendorSchema } from '@ease2event/types';

export class UpdateVendorDto extends createZodDto(CreateVendorSchema.partial()) {}
