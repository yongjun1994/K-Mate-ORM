// 전역 HTTP 예외 필터: 애플리케이션의 모든 예외를 일관된 형태로 처리
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 모든 예외를 캐치
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // 예외 처리 메서드
  catch(exception: unknown, host: ArgumentsHost): void {
    // HTTP 컨텍스트로 전환
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number; // HTTP 상태 코드
    let message: string | string[]; // 에러 메시지
    let error: string; // 에러 타입

    // HttpException인 경우 (NestJS에서 발생하는 예외)
    if (exception instanceof HttpException) {
      status = exception.getStatus(); // HTTP 상태 코드 추출
      const exceptionResponse = exception.getResponse();
      
      // 응답이 문자열인 경우
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        // 응답이 객체인 경우
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      }
    } 
    // 일반 Error인 경우
    else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR; // 500 에러
      message = exception.message;
      error = 'Internal Server Error';
    } 
    // 알 수 없는 예외인 경우
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR; // 500 에러
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    // 표준화된 에러 응답 객체 생성
    const errorResponse = {
      statusCode: status, // HTTP 상태 코드
      timestamp: new Date().toISOString(), // 에러 발생 시간
      path: request.url, // 요청 경로
      method: request.method, // HTTP 메서드
      message: Array.isArray(message) ? message : [message], // 에러 메시지 (배열로 통일)
      error, // 에러 타입
    };

    // 에러 로깅 (개발/운영 환경에서 디버깅용)
    this.logger.error(
      `${request.method} ${request.url}`, // 요청 정보
      exception instanceof Error ? exception.stack : exception, // 스택 트레이스
    );

    // 클라이언트에게 에러 응답 전송
    response.status(status).json(errorResponse);
  }
}
