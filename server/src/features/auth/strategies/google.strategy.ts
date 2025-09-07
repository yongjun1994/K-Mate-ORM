import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: process.env.GOOGLE_CALLBACK_URL!,
			scope: ["email", "profile"],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback
	) {
		console.log("=== [Google OAuth profile] ===");
		console.log(JSON.stringify(profile, null, 2));
		console.log("emails:", profile.emails);
		console.log("photos:", profile.photos);

		const user = {
			google_sub: profile.id,
			email: profile.emails?.[0]?.value,
			name: profile.displayName,
			avatar_url: profile.photos?.[0]?.value,
			email_verified: profile.emails?.[0]?.verified ?? false,
		};
		done(null, user);
	}
}
