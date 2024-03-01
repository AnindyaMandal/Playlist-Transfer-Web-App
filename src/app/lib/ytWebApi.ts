"use server";

let apiCallCount = 0;
export async function searchTrackYT(searchQuery: string) {
	// const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	const apiKey = process.env.GOOGLE_API_KEY;
	// const baseUri = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=";

	const searchUri = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=${encodeURIComponent(
		searchQuery
	)}&safeSearch=none&type=video&key=${apiKey}`;
	console.log("Search URI after encoding: " + searchUri);

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!API CALL!!!!!!!!!!!!!!!!!!!!!!!");

	// console.log("Next is: " + next + " type: " + typeof next);
	try {
		// if (!accessToken) {
		// 	throw new Error("Access token not set");
		// }

		if (!apiKey) {
			throw new Error("Google API Key not set");
		}

		if (apiCallCount > 10) {
			throw new Error(
				"Local API call count exceeded 10. Count: " + apiCallCount
			);
		}

		let response;
		/*
        GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=Wheels%20In%20Motion%20TWRK%20Lady%20Bee&safeSearch=none&type=video&key=[YOUR_API_KEY] HTTP/1.1

        Authorization: Bearer [YOUR_ACCESS_TOKEN]
        Accept: application/json

        */
		response = await fetch(searchUri, {
			// headers: {
			// 	Authorization: "Bearer " + accessToken,
			// 	Accept: "application/json",
			// },
		});

		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		const data = await response.json();

		console.log("API Call Count: " + apiCallCount);
		// console.log("YT Data: ");
		// console.log(data);

		return data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error searchTrackYT: " + error.message + error.name
			);
		}
	}
}

// "use server";
// import { google } from "googleapis";
// import { authenticate } from "@google-cloud/local-auth";

// const youtube = google.youtube("v3");
// const path = require("path");

// export async function searchTrackYT(query: string) {
// 	const auth = await authenticate({
// 		// /home/anindya/coding_projects/spotify_to_youtube/spotify-to-youtube/keys.json
// 		// keyfilePath: path.join(__dirname, "../../../../keys.json"),
// 		keyfilePath: "./src/app/lib/oauth2.keys.json",

// 		scopes: ["https://www.googleapis.com/auth/youtube"],
// 	});
// 	google.options({ auth });

// 	const res = await youtube.search.list({
// 		part: ["snippet"],
// 		q: query,
// 	});
// 	console.log(res.data);
// }
