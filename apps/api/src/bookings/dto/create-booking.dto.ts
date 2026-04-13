import { createZodDto } from 'nestjs-zod';
import { CreateBookingSchema } from '@ease2event/types';

export class CreateBookingDto extends createZodDto(CreateBookingSchema) {}
