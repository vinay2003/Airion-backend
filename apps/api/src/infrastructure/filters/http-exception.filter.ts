import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../../common/exceptions/business-exception';
import { randomUUID } from 'crypto';

/**
 * Enterprise-grade exception filter with tracing and business-logic support
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Generate Correlation ID for log tracing
    const correlationId = randomUUID();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred on our end. Please contact support.';
    let metadata = {};

    if (exception instanceof BusinessException) {
      const body = exception.getResponse() as any;
      status = exception.getStatus();
      errorCode = body.code || 'BUSINESS_LIMIT_REACHED';
      errorMessage = body.message || 'Business logic constraint violated.';
      metadata = body.metadata || {};
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;
      errorMessage = typeof body === 'string' ? body : body.message || body.error || 'Request failed';
      errorCode = typeof body === 'object' && body.error ? body.error.toUpperCase().replace(/\s+/g, '_') : 'HTTP_EXCEPTION';
    } else if (exception instanceof Error) {
       // Detailed logging for standard system errors
       this.logger.error(`[${correlationId}] System Error: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      success: false,
      data: null,
      error: errorMessage,
      code: errorCode,
      statusCode: status,
      correlationId,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    };

    if (status >= 500) {
      this.logger.error(
        `[${correlationId}] ${request.method} ${request.url} FAILED: ${status}`,
        exception instanceof Error ? exception.stack : 'Unknown crash source',
      );
    } else {
      this.logger.warn(
        `[${correlationId}] ${request.method} ${request.url} ${status} - ${errorMessage}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
