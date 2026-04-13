import { createZodDto } from 'nestjs-zod';
import { CreateVendorSchema } from '@ease2event/types';

export class CreateVendorDto extends createZodDto(CreateVendorSchema) {}
