"use server";

import { redirect } from "next/navigation";

const clientID = process.env.SPOTIFY_CLIENT_ID;
const scope = "playlist-modify-private user-library-read";

function getSpotifyAuth() {
	const generateRandomString = (length: number) => {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce(
			(acc, x) => acc + possible[x % possible.length],
			""
		);
	};
	const redirectUri = "http://localhost:3000/spotifyAuthentication/";

	// const sha256_mine = async (content: string) => {
	// 	return createHash("sha256").update(content).digest("base64");
	// };

	// const base64encode = (input: ArrayBuffer) => {
	// 	return btoa(String.fromCharCode(...new Uint8Array(input)))
	// 		.replace(/=/g, "")
	// 		.replace(/\+/g, "-")
	// 		.replace(/\//g, "_");
	// };

	// const codeVerifier = generateRandomString(64);
	// const codeChallenge = await sha256_mine(codeVerifier);
	const state = generateRandomString(16);

	const authUrl = new URL("https://accounts.spotify.com/authorize?");
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", clientID!);
	authUrl.searchParams.set("scope", scope);
	// authUrl.searchParams.set("code_challenge_method", "S256");
	// authUrl.searchParams.set("code_challenge", codeChallenge);
	authUrl.searchParams.set("state", state);
	authUrl.searchParams.set("redirect_uri", redirectUri!);

	console.log("Client ID:" + clientID);
	const url = authUrl.href.replaceAll("%3A", ":").replaceAll("%2F", "/");
	console.log("URL: " + url);
	// return url;
	open(url);
}

export { getSpotifyAuth };
