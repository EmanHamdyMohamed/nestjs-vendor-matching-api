import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../base-response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        // If data is already a BaseResponse, return it as is
        if (data instanceof BaseResponse) {
          return data;
        }

        // If data is null or undefined, return empty response
        if (data === null || data === undefined) {
          return BaseResponse.success(null, 'No data found', statusCode);
        }

        // Wrap the data in BaseResponse
        return BaseResponse.success(data, 'Success', statusCode);
      }),
    );
  }
}
