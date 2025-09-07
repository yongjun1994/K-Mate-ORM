// Google OAuth 2.0 인증 전략
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID!, // Google OAuth 클라이언트 ID
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google OAuth 클라이언트 시크릿
			callbackURL: process.env.GOOGLE_CALLBACK_URL!, // OAuth 콜백 URL
			scope: ["email", "profile"], // 요청할 권한 범위: 이메일과 프로필 정보
		});
	}

	// Google OAuth 인증 성공 후 사용자 정보 검증 및 변환
	async validate(
		accessToken: string, // Google에서 받은 액세스 토큰
		refreshToken: string, // Google에서 받은 리프레시 토큰
		profile: any, // Google 프로필 정보
		done: VerifyCallback // Passport 콜백 함수
	) {
		// 개발 환경에서 프로필 정보 로깅 (디버깅용)
		console.log("=== [Google OAuth profile] ===");
		console.log(JSON.stringify(profile, null, 2));
		console.log("emails:", profile.emails);
		console.log("photos:", profile.photos);

		// Google 프로필 정보를 앱 사용자 정보로 변환
		const user = {
			google_sub: profile.id, // Google 고유 사용자 ID
			email: profile.emails?.[0]?.value, // 첫 번째 이메일 주소
			name: profile.displayName, // 표시 이름
			avatar_url: profile.photos?.[0]?.value, // 첫 번째 프로필 사진 URL
			email_verified: profile.emails?.[0]?.verified ?? false, // 이메일 인증 여부
		};
		
		// Passport에 사용자 정보 전달 (인증 성공)
		done(null, user);
	}
}
