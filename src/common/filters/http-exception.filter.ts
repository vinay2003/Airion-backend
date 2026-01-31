import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determine status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Extract error message
        let message: string | string[] = 'Internal server error';
        let errorName = 'InternalServerError';

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || message;
                errorName = exception.name;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            errorName = exception.name;
        }

        // Log error for debugging (server-side only)
        const isProduction = process.env.NODE_ENV === 'production';

        if (status >= 500) {
            // Always log server errors
            this.logger.error(
                `${request.method} ${request.url} - ${status} ${errorName}: ${message}`,
                exception instanceof Error ? exception.stack : undefined
            );
        } else if (!isProduction) {
            // Log client errors in development only
            this.logger.warn(
                `${request.method} ${request.url} - ${status} ${errorName}: ${message}`
            );
        }

        // Build error response
        const errorResponse: any = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
        };

        // Only include stack trace in development
        if (!isProduction && exception instanceof Error) {
            errorResponse.error = errorName;
            errorResponse.stack = exception.stack;
        } else {
            // Production: clean error name only
            errorResponse.error = errorName;
        }

        response.status(status).json(errorResponse);
    }
}
