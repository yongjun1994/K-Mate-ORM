// 인증 서비스: 사용자 인증 및 JWT 토큰 관리
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

// Google OAuth에서 받아오는 사용자 정보 타입 정의
type GoogleUser = {
	google_sub: string; // Google 고유 사용자 ID
	email?: string; // 이메일 주소
	name?: string; // 사용자 이름
	avatar_url?: string; // 프로필 이미지 URL
	email_verified?: boolean; // 이메일 인증 여부
};

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService, // JWT 토큰 생성/검증 서비스
		@InjectRepository(User) // User 엔티티 Repository 주입
		private readonly userRepository: Repository<User>
	) {}

	// Google 사용자 정보로 사용자 생성 또는 업데이트 (upsert)
	async upsertUser(gu: GoogleUser) {
		// Google sub ID로 기존 사용자 조회
		let user = await this.userRepository.findOne({
			where: { google_sub: gu.google_sub }
		});

		if (user) {
			// 기존 사용자가 있는 경우 정보 업데이트
			user.email = gu.email ?? user.email;
			user.name = gu.name ?? user.name;
			user.avatar_url = gu.avatar_url ?? user.avatar_url;
			user.email_verified = gu.email_verified ?? user.email_verified;
			user = await this.userRepository.save(user);
		} else {
			// 새 사용자인 경우 생성
			user = this.userRepository.create({
				google_sub: gu.google_sub,
				email: gu.email,
				name: gu.name,
				avatar_url: gu.avatar_url,
				email_verified: gu.email_verified ?? false,
				role: 'user' // 기본 역할을 'user'로 설정
			});
			user = await this.userRepository.save(user);
		}

		return user;
	}

	// JWT 액세스 토큰과 리프레시 토큰 발급
	async issueJwt(user: {
		id: number;
		email?: string;
		role?: "user" | "admin";
	}) {
		// JWT 페이로드 구성
		const payload = {
			sub: user.id, // 사용자 ID (subject)
			email: user.email, // 사용자 이메일
			role: user.role ?? "user", // 사용자 역할 (기본값: user)
		};
		
		// 액세스 토큰 생성 (짧은 만료 시간)
		const accessToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET!,
			expiresIn: process.env.JWT_EXPIRES_IN ?? "3600s", // 기본 1시간
		});
		
		// 리프레시 토큰 생성 (긴 만료 시간)
		const refreshToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_REFRESH_SECRET!,
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d", // 기본 7일
		});
		
		return { accessToken, refreshToken };
	}

}
