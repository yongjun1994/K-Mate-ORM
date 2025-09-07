// 인증 관련 모듈: JWT와 Google OAuth 인증을 담당
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { User } from "../users/entities/user.entity";

@Module({
	imports: [
		// User 엔티티를 TypeORM에 등록하여 Repository 사용 가능
		TypeOrmModule.forFeature([User]),
		// Passport 모듈 등록: 세션 기반 인증 비활성화 (JWT 사용)
		PassportModule.register({ session: false }),
		// JWT 모듈 등록: 토큰 생성 및 검증을 위한 설정
		JwtModule.register({
			secret: process.env.JWT_SECRET!, // JWT 서명을 위한 비밀키
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "3600s" }, // 토큰 만료 시간 (기본 1시간)
		}),
	],
	controllers: [AuthController], // 인증 관련 API 엔드포인트
	providers: [
		AuthService, // 인증 비즈니스 로직
		JwtStrategy, // JWT 토큰 검증 전략
		// Google OAuth 설정이 있을 때만 GoogleStrategy 활성화
		...(process.env.GOOGLE_CLIENT_ID ? [GoogleStrategy] : []),
	],
	exports: [AuthService], // 다른 모듈에서 AuthService 사용 가능하도록 export
})
export class AuthModule {}
