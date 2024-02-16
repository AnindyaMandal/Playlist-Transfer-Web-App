import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes = [
	"user-read-email",
	"user-read-private",
	"playlist-modify-private",
	"playlist-read-private",
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
	],
	callbacks: {
		async redirect({ url, baseUrl }) {
			if (url.startsWith("/")) {
				console.log("Callback: " + `${baseUrl}  ${url}`);
				return `${baseUrl}  ${url}`;
			} else if (new URL(url).origin === baseUrl) {
				console.log("Callback: " + `${baseUrl}  ${url}`);
				return url;
			}
			return baseUrl;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === "spotify") {
				const accessToken = account.access_token;
				process.env.ACCESS_TOKEN = accessToken;
				console.log("ACCESS TOKEN: " + process.env.ACCESS_TOKEN);
				console.log(account.token_type);
				console.log(account.scope);
				console.log(account.expires_at);
				console.log(account.refresh_token);
			}
			return true;
		},
	},
};
