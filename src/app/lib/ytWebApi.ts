"use server";
import { error } from "console";
import { google } from "googleapis";
import { YouTubePlaylistsResource } from "../definitions/YouTubePlaylistsResource";
import { TrackData } from "../definitions/TrackData";

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
	let vidData = data.items[0];

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
		vidData = data.items[i];
		break;
	}

	console.log("Link:\t" + youtubeVidBaseURI + vidID);
	// return youtubeVidBaseURI + vidID;
	const returnData = {
		ytURI: youtubeVidBaseURI + vidID,
		ytData: vidData,
	};

	return returnData;
}

// "use server";
// import { authenticate } from "@google-cloud/local-auth";

// Gets user's created playlists from youtube
// User must be authenticated to youtube for this to work
export async function getYoutubePlaylists() {
	try {
		const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

		if (!accessToken) {
			throw new Error("No youtube access token found");
		}

		const oauth2client = new google.auth.OAuth2({});
		oauth2client.setCredentials({
			access_token: accessToken,
		});

		const ytv3 = google.youtube({ version: "v3", auth: oauth2client });

		const response = await ytv3.playlists.list({
			part: ["snippet"],
			mine: true,
			maxResults: 50,
		});
		console.log(response.data.items);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getPlaylistTracks: " + error.message + error.name
			);
		}
	}
}

export async function addYoutubePlaylist(playlistTitle: string) {
	try {
		const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

		if (!accessToken) {
			throw new Error("No youtube access token found");
		}

		const oauth2client = new google.auth.OAuth2({});
		oauth2client.setCredentials({
			access_token: accessToken,
		});

		const ytv3 = google.youtube({ version: "v3", auth: oauth2client });

		let playlistId = null;

		const res = await ytv3.playlists.insert({
			part: ["snippet"],
			requestBody: {
				snippet: {
					title: playlistTitle,
				},
			},
		});
		// Callback
		// (err, res) => {
		// 	if (err) {
		// 		console.error(err);
		// 		throw err;
		// 	}
		// 	console.log(`The response is: `);
		// 	console.log(res?.data);
		// 	console.log(res?.status);
		// 	console.log(res?.statusText);
		// 	playlistId = res?.data.id;
		// };
		console.log(`The response is: `);
		// console.log(res?.data);
		console.log(res?.status);
		console.log(res?.statusText);
		playlistId = res?.data.id;

		console.log("Got PlaylistID: " + playlistId);
		return playlistId;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log("Fetch Error: " + error.message + error.name);
			console.log(error);
		}
	}
}

export async function addSpotifyPlistYoutube(
	playlistTitle: string,
	spotifyPlaylist: TrackData
) {
	try {
		const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

		if (!accessToken) {
			throw new Error("No youtube access token found");
		}

		// const playlistId = await addYoutubePlaylist(playlistTitle);
		const playlistId = "PLo09mDgT9n2VlqwXMXwBl2KKZ85eRbswP";
		console.log("playlistID: " + playlistId);
		const oauth2client = new google.auth.OAuth2({});
		oauth2client.setCredentials({
			access_token: accessToken,
		});

		const ytv3 = google.youtube({ version: "v3", auth: oauth2client });

		for (let trackItem of spotifyPlaylist.items) {
			if (trackItem.ytURI == "") {
				console.log("No YouTube URI for track: " + trackItem.trackName);
				continue;
			}
			const uri = trackItem.ytURI;
			const videoId = uri.split("/watch?v=")[1];
			console.log("\nURI: " + uri);
			console.log("VidID: " + videoId);

			// const params = {
			// 	snippet: {
			// 		playlistId: playlistId,
			// 		resourceId: {
			// 			kind: "youtube#video",
			// 			videoId: videoId,
			// 		},
			// 	},
			// };

			const res = await ytv3.playlistItems.insert({
				part: ["snippet"],
				requestBody: {
					snippet: {
						playlistId: playlistId,
						resourceId: {
							kind: "youtube#video",
							videoId: videoId,
						},
					},
				},
			});

			console.log("Added Track to playlist...vidID: " + videoId);
			console.log(res.status);
			// CALLBACK
			// ,
			// 	(err, res) => {
			// 		if (err) {
			// 			console.error(err);
			// 			throw err;
			// 		}
			// 		console.log(`The response is: `);
			// 		console.log(res?.data);
			// 		console.log(res?.status);
			// 		console.log(res?.statusText);
			// 	}
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log("Fetch Error: " + error.message + error.name);
			console.log(error);
		}
	}
}
