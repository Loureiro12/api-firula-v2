import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse =
      exception.getResponse() as ValidationExceptionResponse;

    // Verificar se é um erro de validação
    if (
      status === 400 &&
      exceptionResponse.message &&
      Array.isArray(exceptionResponse.message)
    ) {
      return response.status(status).json({
        success: false,
        message: 'Validation failed',
        data: {
          errors: exceptionResponse.message,
        },
      });
    }

    // Para outros tipos de BadRequestException
    return response.status(status).json({
      success: false,
      message:
        typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : 'Bad request',
      data: null,
    });
  }
}
