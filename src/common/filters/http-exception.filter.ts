import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../base-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message) 
          ? exceptionResponse.message[0] 
          : exceptionResponse.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = BaseResponse.error(message, status);
    
    response.status(status).json(errorResponse);
  }
}
