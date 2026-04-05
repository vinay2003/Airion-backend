import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SuccessResponseSchema = z.object({
  success: z.boolean().default(true),
  data: z.any().optional(),
  message: z.string().optional(),
});

export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}
