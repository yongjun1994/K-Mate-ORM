import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

type GoogleUser = {
	google_sub: string;
	email?: string;
	name?: string;
	avatar_url?: string;
	email_verified?: boolean;
};

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async upsertUser(gu: GoogleUser) {
		let user = await this.userRepository.findOne({
			where: { google_sub: gu.google_sub }
		});

		if (user) {
			user.email = gu.email ?? user.email;
			user.name = gu.name ?? user.name;
			user.avatar_url = gu.avatar_url ?? user.avatar_url;
			user.email_verified = gu.email_verified ?? user.email_verified;
			user = await this.userRepository.save(user);
		} else {
			user = this.userRepository.create({
				google_sub: gu.google_sub,
				email: gu.email,
				name: gu.name,
				avatar_url: gu.avatar_url,
				email_verified: gu.email_verified ?? false,
				role: 'user'
			});
			user = await this.userRepository.save(user);
		}

		return user;
	}

	async issueJwt(user: {
		id: number;
		email?: string;
		role?: "user" | "admin";
	}) {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role ?? "user",
		};
		const accessToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET!,
			expiresIn: process.env.JWT_EXPIRES_IN ?? "3600s",
		});
		const refreshToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_REFRESH_SECRET!,
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
		});
		return { accessToken, refreshToken };
	}

}
