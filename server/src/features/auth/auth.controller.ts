// 인증 컨트롤러: Google OAuth 인증 API 엔드포인트
import { Controller, Get, Post, Req, Res, UseGuards, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags('auth') // Swagger 문서에서 'auth' 태그로 그룹화
@Controller("auth") // '/auth' 경로로 라우팅
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// Google OAuth 로그인 시작 엔드포인트
	@Get("google")
	@UseGuards(AuthGuard("google")) // Google OAuth 전략 가드 적용
	@ApiOperation({ summary: 'Start Google OAuth login' })
	@ApiResponse({ status: 302, description: 'Redirects to Google login page' })
	async googleAuth() {
		// Passport가 자동으로 Google OAuth 페이지로 리다이렉트
	}

	// Google OAuth 콜백 엔드포인트
	@Get("google/callback")
	@UseGuards(AuthGuard("google")) // Google OAuth 전략 가드 적용
	@ApiOperation({ summary: 'Google OAuth callback' })
	@ApiResponse({ status: 302, description: 'Redirects to frontend with tokens' })
	async googleCallback(@Req() req: Request, @Res() res: Response) {
		const frontend = process.env.FRONTEND_URL!; // 프론트엔드 URL
		try {
			// Passport가 설정한 사용자 정보 추출
			const googleUser = req.user as any;
			// Google 사용자 정보로 앱 사용자 생성/업데이트
			const appUser = await this.authService.upsertUser(googleUser);
			// JWT 토큰 발급
			const { accessToken, refreshToken } = await this.authService.issueJwt(appUser);

			// 프론트엔드 콜백 URL 생성
			const url = new URL("/auth/callback", frontend);
			// URL 파라미터로 토큰 전달
			url.searchParams.set("access_token", accessToken);
			url.searchParams.set("refresh_token", refreshToken);
			// 프론트엔드로 리다이렉트
			return res.redirect(url.toString());

		} catch (e) {
			// 인증 실패 시 에러 페이지로 리다이렉트
			return res.redirect(`${frontend}/login?error=oauth_failed`);
		}
	}

}
