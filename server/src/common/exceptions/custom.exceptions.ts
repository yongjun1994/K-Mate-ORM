// 커스텀 예외 클래스들
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(validationErrors: any[]) {
    super(
      {
        message: 'Validation failed',
        errors: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
