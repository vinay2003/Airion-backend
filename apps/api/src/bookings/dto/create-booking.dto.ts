import { createZodDto } from 'nestjs-zod';
import { CreateBookingSchema } from '@airion/types';

export class CreateBookingDto extends createZodDto(CreateBookingSchema) {}
