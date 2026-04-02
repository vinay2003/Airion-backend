import { createZodDto } from 'nestjs-zod';
import { CreateVendorSchema } from '@airion/types';

export class CreateVendorDto extends createZodDto(CreateVendorSchema) {}
