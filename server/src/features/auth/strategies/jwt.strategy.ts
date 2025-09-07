// JWT 토큰 검증 전략
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			secretOrKey: process.env.JWT_SECRET!, // JWT 서명 검증을 위한 비밀키
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 Bearer 토큰 추출
			ignoreExpiration: false, // 토큰 만료 시간 검증 활성화
		});
	}

	// JWT 토큰 검증 성공 후 페이로드에서 사용자 정보 추출
	async validate(payload: any) {
		// JWT 페이로드를 사용자 정보 객체로 변환하여 반환
		// 이 정보는 req.user에 저장되어 가드나 컨트롤러에서 사용 가능
		return { 
			userId: payload.sub, // 사용자 ID (subject)
			email: payload.email, // 사용자 이메일
			role: payload.role // 사용자 역할 (user/admin)
		};
	}
}
