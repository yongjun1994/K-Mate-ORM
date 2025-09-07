// NestJS 애플리케이션의 진입점
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ValidationException } from "./common/exceptions/custom.exceptions";

// 애플리케이션 부트스트랩 함수
async function bootstrap() {
	// NestJS 애플리케이션 인스턴스 생성
	const app = await NestFactory.create(AppModule);

	// CORS 설정: 프론트엔드 도메인에서의 접근 허용
	app.enableCors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Vite 개발 서버 주소
		credentials: true, // 쿠키와 인증 정보 포함 요청 허용
	});

	// 전역 유효성 검사 파이프 설정
	app.useGlobalPipes(new ValidationPipe({ 
		whitelist: true, // DTO에 정의되지 않은 속성 제거
		transform: true, // 자동 타입 변환 활성화
		exceptionFactory: (errors) => {
			// 유효성 검사 실패 시 커스텀 예외 생성
			const result = errors.map((error) => ({
				property: error.property, // 검증 실패한 속성명
				value: error.value, // 입력된 값
				constraints: error.constraints, // 검증 규칙과 메시지
			}));
			return new ValidationException(result);
		},
	}));
	
	// 전역 예외 필터 적용
	app.useGlobalFilters(new HttpExceptionFilter());

	// Swagger API 문서 설정
	const config = new DocumentBuilder()
		.setTitle("K-Mate API") // API 문서 제목
		.setDescription("K-Mate Backend API Docs") // API 설명
		.setVersion("1.0.0") // API 버전
		.addBearerAuth() // JWT Bearer 토큰 인증 스키마 추가
		.build();

	// Swagger 문서 생성 및 설정
	const doc = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/docs", app, doc); // /docs 경로에서 API 문서 제공

	// 서버 시작: 환경변수 PORT 또는 기본값 3000 포트에서 실행
	await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
