import { HttpException, HttpStatus } from '@nestjs/common';

export type BusinessErrorCode =
  | 'INSUFFICIENT_FUNDS'
  | 'VENDOR_NOT_VERIFIED'
  | 'SLOT_ALREADY_BOOKED'
  | 'UNAUTHORIZED_ACCESS'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

/**
 * Robust Business Exception for granular API error reporting
 */
export class BusinessException extends HttpException {
  constructor(
    public readonly code: BusinessErrorCode,
    public readonly description: string,
    public readonly metadata: Record<string, any> = {},
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        code,
        message: description,
        metadata,
        success: false,
      },
      status,
    );
  }
}
