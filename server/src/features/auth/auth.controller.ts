import { Controller, Get, Post, Req, Res, UseGuards, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";


@ApiTags('auth')
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("google")
	@UseGuards(AuthGuard("google"))
	@ApiOperation({ summary: 'Start Google OAuth login' })
	@ApiResponse({ status: 302, description: 'Redirects to Google login page' })
	async googleAuth() {}

	@Get("google/callback")
	@UseGuards(AuthGuard("google"))
	@ApiOperation({ summary: 'Google OAuth callback' })
	@ApiResponse({ status: 302, description: 'Redirects to frontend with tokens' })
	async googleCallback(@Req() req: Request, @Res() res: Response) {
		const frontend = process.env.FRONTEND_URL!;
		try {
			const googleUser = req.user as any;
			const appUser = await this.authService.upsertUser(googleUser);
			const { accessToken, refreshToken } = await this.authService.issueJwt(appUser);

			const url = new URL("/auth/callback", frontend);
			url.searchParams.set("access_token", accessToken);
			url.searchParams.set("refresh_token", refreshToken);
			return res.redirect(url.toString());

		} catch (e) {
			return res.redirect(`${frontend}/login?error=oauth_failed`);
		}
	}

}
