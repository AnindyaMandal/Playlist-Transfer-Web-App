"use server";

let apiCallCount = 0;
const youtubeVidBaseURI = "https://www.youtube.com/watch?v=";

// Recieves a query param extracted from the song item
// Searches it using YouTube API
// Returns an object containing 50 results
//
// TODO:
//
// SHOULD RETURN A SINGLE LINK PER SEARCH INSTEAD OF A WHOLE OBJECT
//
// Maybe it should parse the query in a function here
// Find link that best fits query
// Since we are searching for songs, check if the channel contains the artists name(s)
// Check if the channel name contains VEVO
// Check if the query asked for remix or cover or instrumental or slowed or reverb or bass boosted, if so check if the video title satisfies requirements
export async function searchTrackYT(searchQuery: string) {
	// const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
	// const baseUri = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=";

	const apiKey = process.env.GOOGLE_API_KEY;

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
		response = await fetch(searchUri);

		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		const data = await response.json();

		console.log("API Call Count: " + apiCallCount);
		// console.log("YT Data: ");
		// console.log(data);

		// return data;
		return findBestMatch(searchQuery, data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error searchTrackYT: " + error.message + error.name
			);
		}
	}
}

// Finds the best matching song from the data object and the user's query
// Checks to see if the channel name contains artist name(s)/NoCopyrightSounds/Monstercat
// Filters for remix, instrumental, sped up, nightcore, cover, reverb, slowed, bass boosted
// DATA FORMAT:
// {
// 	"kind": "youtube#searchListResponse",
// 	"etag": "eoYN3ua7k3sY2xaTbn3exXMVk5s",
// 	"nextPageToken": "CDIQAA",
// 	"regionCode": "US",
// 	"pageInfo": {
// 	  "totalResults": 1000000,
// 	  "resultsPerPage": 50
// 	},
// 	"items": [
// 	  {
// 		"kind": "youtube#searchResult",
// 		"etag": "O4wLJ-yp3qsPIivSwAAo5jMy4ao",
// 		"id": {
// 		  "kind": "youtube#video",
// 		  "videoId": "sVx1mJDeUjY"
// 		},
// 		"snippet": {
// 		  "publishedAt": "2015-02-02T21:02:26Z",
// 		  "channelId": "UC7C0JKhMViaCv7AUubtEMng",
// 		  "title": "Mr.Kitty - After Dark",
// 		  "description": "From the album \"TIME\" https://mrkittyngp.bandcamp.com/album/time Lyrics: I see you You see me How pleasant This feeling The ...",
// 		  "thumbnails": {
// 			"default": {
// 			  "url": "https://i.ytimg.com/vi/sVx1mJDeUjY/default.jpg",
// 			  "width": 120,
// 			  "height": 90
// 			},
// 			"medium": {
// 			  "url": "https://i.ytimg.com/vi/sVx1mJDeUjY/mqdefault.jpg",
// 			  "width": 320,
// 			  "height": 180
// 			},
// 			"high": {
// 			  "url": "https://i.ytimg.com/vi/sVx1mJDeUjY/hqdefault.jpg",
// 			  "width": 480,
// 			  "height": 360
// 			}
// 		  },
// 		  "channelTitle": "Mr.Kitty Official",
// 		  "liveBroadcastContent": "none",
// 		  "publishTime": "2015-02-02T21:02:26Z"
// 		}
// 	  },
function findBestMatch(searchQuery: string, data: any) {
	console.log("Finding best match for query: " + searchQuery);

	// All possbile keywords to check for
	const keywords = [
		"remix",
		"instrumental",
		"sped up",
		"nightcore",
		"cover",
		"reverb",
		"slowed",
		"bass boosted",
	];

	// Restricted keywords in the YT vid title
	let restrictedKeywords: string[] = [];
	keywords.forEach((keyword: string) => {
		if (
			searchQuery
				.toLocaleLowerCase()
				.replace(/[^a-zA-Z ]/g, " ")
				.includes(keyword) == false
		)
			restrictedKeywords.push(keyword);
	});

	let vidID = data.items[0].id.videoId;

	// Check if the result titles have restricted words, if so check the next one
	// breaks as soon as it finds a suitable one
	// Otherwise function returns the first result
	for (let i = 0; i < 50; i++) {
		let title = data.items[i].snippet.title;
		let chName = data.items[i].snippet.channelTitle;

		if (
			restrictedKeywords.some((restrictedKeyword) =>
				title.includes(restrictedKeyword)
			)
		) {
			continue;
		}

		vidID = data.items[i].id.videoId;
		break;
	}

	console.log("Link:\t" + youtubeVidBaseURI + vidID);
	return youtubeVidBaseURI + vidID;
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
