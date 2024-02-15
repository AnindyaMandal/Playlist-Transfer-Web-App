"use server";
import React from "react";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

function getCode() {
	const clientID = process.env.SPOTIFY_CLIENT_ID;
	const redirectUri = "http://localhost:3000/lmao";
	const scope = "playlist-modify-private user-library-read";
	const authUrl = new URL("https://accounts.spotify.com/authorize?");

	const generateRandomString = (length: number) => {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce(
			(acc, x) => acc + possible[x % possible.length],
			""
		);
	};

	const state = generateRandomString(16);

	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", clientID!);
	authUrl.searchParams.set("scope", scope);

	authUrl.searchParams.set("state", state);
	authUrl.searchParams.set("redirect_uri", redirectUri!);

	console.log("Client ID:" + clientID);
	const url = authUrl.href.replaceAll("%3A", ":").replaceAll("%2F", "/");

	redirect(url);
}

function SpAuthGet() {
	if (typeof window !== "undefined") {
		console.log("Checking window");
		console.log(window.location.href);
	}
	getCode();

	return (
		<div>
			<h1>Authenticating...</h1>
		</div>
	);
}

export default SpAuthGet;
