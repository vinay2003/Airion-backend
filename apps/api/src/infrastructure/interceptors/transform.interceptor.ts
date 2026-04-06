import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // If data is already in expected format (from some specific controllers), skip formatting
        if (data && typeof data === 'object' && 'success' in data && ('data' in data || 'booking' in data)) {
            // Normalize custom ones like { success: true, booking: ... } to { success: true, data: { booking: ... } }
            // Let's just return it as is if it has success flag to prevent double wrapping
            if ('data' in data) return data;
        }

        return {
          success: true,
          data: data === undefined ? {} : data,
          error: null
        };
      }),
    );
  }
}
