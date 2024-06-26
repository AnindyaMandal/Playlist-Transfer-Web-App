import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import GoogleProvider from "next-auth/providers/google";
import { generate } from "short-uuid";
import { cookies } from "next/headers";
import { addSessionData } from "@/app/lib/actions/sessionUUID.actions";

const scopes = [
	"user-read-email",
	"user-read-private",
	// "playlist-modify-private",
	"playlist-read-private",
	"playlist-read-collaborative",
	"user-library-read",
	"user-read-recently-played",
	"user-top-read",
	"user-read-playback-position",
];

export const options: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			authorization:
				"https://accounts.spotify.com/authorize?scope=" +
				scopes.join("+"),
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					scope: [
						"openid",
						"https://www.googleapis.com/auth/userinfo.email",
						"https://www.googleapis.com/auth/userinfo.profile",
						"https://www.googleapis.com/auth/youtube",
					].join(" "),
					prompt: "consent",
					access_type: "online",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		async redirect({ url, baseUrl }) {
			if (url.startsWith("/")) {
				console.log("Callback /: " + `${baseUrl}  ${url}`);
				return `${baseUrl}  ${url}`;
			} else if (new URL(url).origin === baseUrl) {
				console.log("Callback url is base: " + `${baseUrl}  ${url}`);
				return baseUrl + "/spotify";
			}
			return baseUrl;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === "spotify") {
				const accessToken = account.access_token;
				const expireTime = account.expires_at;
				const userId = user.id;
				// process.env.SPOTIFY_ACCESS_TOKEN = accessToken;
				// console.log(
				// 	"SPOTIFY ACCESS TOKEN: " + process.env.SPOTIFY_ACCESS_TOKEN
				// );
				console.log(account.token_type);
				console.log(account.scope);
				console.log("Current: " + Math.round(Date.now() / 1000));
				console.log("Expires: " + account.expires_at);
				console.log(
					"Difference: ",
					expireTime! - Math.round(Date.now() / 1000)
				);

				console.log(user);
				console.log(profile);

				let uuid = cookies().get("sessionID")?.value;
				console.log("existing session cookie ID: " + uuid);
				if (uuid == undefined) {
					uuid = generate();
					console.log("No existing cookie...\nNew Cookie: " + uuid);
					cookies().set("sessionID", uuid, {
						maxAge: 3600,
						sameSite: "lax",
					});
				}

				await addSessionData(uuid.toString(), accessToken!, userId);
			}

			if (account?.provider === "google") {
				const accessToken = account.access_token;
				process.env.GOOGLE_ACCESS_TOKEN = accessToken;
				console.log(
					"GOOGLE ACCESS TOKEN: " + process.env.GOOGLE_ACCESS_TOKEN
				);
				console.log(account.token_type);
				console.log(account.scope);
				console.log(account.expires_at);
				console.log(account.refresh_token);
				console.log(
					"Difference: ",
					account.expires_at! - Math.round(Date.now() / 1000)
				);

				let uuid = cookies().get("sessionID")?.value;
				console.log("existing session cookie ID: " + uuid);
				if (uuid == undefined) {
					uuid = generate();
					console.log("No existing cookie...\nNew Cookie: " + uuid);
					cookies().set("sessionID", uuid, {
						maxAge: 3600,
						sameSite: "lax",
					});
				}

				await addSessionData(uuid.toString(), null, null, accessToken);
			}
			return true;
		},
	},
};
