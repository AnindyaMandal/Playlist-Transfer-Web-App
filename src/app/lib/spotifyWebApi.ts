"use server";
import { ArtistData } from "../definitions/ArtistData";
import { PlaylistData } from "../definitions/PlaylistData";
import { PlaylistItem } from "../definitions/PlaylistItem";
import { TrackData } from "../definitions/TrackData";
import { TrackItem } from "../definitions/TrackItem";

// Failsafe when its more than 10 no more API calls, change this in the functions below
let apiCallCount = 0;

// Gets users playlists
// If there are more than 50, recursively gets the next 50 until no more left
export async function getUserPlaylists(
	next: string | null = null
): Promise<PlaylistData | undefined> {
	const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined;

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!API CALL!!!!!!!!!!!!!!!!!!!!!!!");

	// console.log("Next is: " + next + " type: " + typeof next);
	try {
		if (!accessToken) {
			throw new Error("Access token not set");
		}

		if (apiCallCount > 10) {
			throw new Error(
				"Local API call count exceeded 10. Count: " + apiCallCount
			);
		}

		let response;

		if (next == null) {
			console.log("Next is Null!");
			apiCallCount += 1;

			response = await fetch(
				baseUri + `/v1/me/playlists?limit=50&offset=0`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		} else {
			console.log("Next not null");
			console.log("Next: " + next);
			// https://api.spotify.com/v1/users/anindya098/playlists?offset=20&limit=10
			const urlParams = next.split("playlists?offset=");
			const nextOffset = urlParams[1].split("&limit=")[0];

			console.log("Offset value: " + nextOffset);
			apiCallCount += 1;
			console.log(
				"\nFetching from....  " +
					baseUri +
					`/v1/me/playlists?limit=50&offset=${nextOffset}`
			);

			response = await fetch(
				baseUri + `/v1/me/playlists?limit=50&offset=${nextOffset}`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		}
		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		const data = await response.json();

		// console.log(data);
		console.log("Total Playlists: " + data.total);
		console.log("API Call Count: " + apiCallCount);
		cleanData = {
			next: data.next,
			total: data.total,
			items: data.items.map((element: any): PlaylistItem => {
				const items = {
					name: element.name,
					description: element.description,
					id: element.id,
					track_href: element.tracks.href,
					track_total: element.tracks.total,
				};
				return items;
			}),
		};

		// console.log("Clean Data:");
		// console.log(cleanData);
		// return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getUserPlaylists: " + error.message + error.name
			);
		}
	}
	try {
		if (!cleanData) throw new Error("Clean data is undefined");
		// There are tracks that exist in next
		// we need to keep going and do fetch req until next is null
		// the return value from recursive calls should update the clean data every return
		// The final return should have a proper array of items, next should be null
		if (cleanData.next != null) {
			console.log("Next is: " + cleanData.next);
			console.log("Recursing...");
			const nextData = await getUserPlaylists((next = cleanData.next));

			console.log("NextData from recursion: ");
			console.log(nextData);
			cleanData.next = nextData?.next;
			Array.prototype.push.apply(cleanData.items, nextData?.items!);
			console.log("Concatinated Data from recursion: ");
			console.log(cleanData);

			// TODO: Concat nextData and cleanData
		}

		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getUserPlaylists recursion: " +
					error.message +
					error.name
			);
		}
	}
}

// Gets all tracks from a playlist
// If there are more than 50, recursively gets the next 50 until no more left
// TODO:
//
// Look into pagination for this, no reason to get 4k songs at once from playlists.
export async function getPlaylistTracks(
	playlistID: string,
	next: string | null = null
): Promise<TrackData | undefined> {
	const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined;
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!API CALL!!!!!!!!!!!!!!!!!!!!!!!");

	// console.log("Next is: " + next + " type: " + typeof next);
	try {
		if (!accessToken) {
			throw new Error("Access token not set");
		}

		if (apiCallCount > 10) {
			throw new Error(
				"Local API call count exceeded 10. Count: " + apiCallCount
			);
		}

		let response;

		if (next == null) {
			console.log("Next is Null!");
			apiCallCount += 1;

			response = await fetch(
				baseUri +
					`/v1/playlists/${playlistID}/tracks?limit=50&offset=0`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		} else {
			// Splitting next URL to get the offset to make the next call
			console.log("Next not null");
			console.log("Next URL: " + next);
			// https://api.spotify.com/v1/users/anindya098/playlists?offset=20&limit=10
			let nextUrlParams = new URL(next);
			let nextOffset = nextUrlParams.searchParams.get("offset");
			// const urlParams = next.split("playlists?offset=");
			// const nextOffset = urlParams[1].split("&limit=")[0];

			console.log("Offset value: " + nextOffset);
			apiCallCount += 1;
			console.log(
				"\nFetching from....  " +
					baseUri +
					`/v1/playlists/${playlistID}/tracks?limit=50&offset=${nextOffset}`
			);

			response = await fetch(
				baseUri +
					`/v1/playlists/${playlistID}/tracks?limit=50&offset=${nextOffset}`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		}
		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		const data = await response.json();

		// console.log(data);
		// console.log(data.items[0].track);
		console.log("Total Songs: " + data.total);
		console.log("API Call Count: " + apiCallCount);
		cleanData = {
			next: data.next,
			total: data.total,
			playlistID: playlistID,
			items: data.items.map((element: any): TrackItem => {
				const items = {
					trackID: element.track.id,
					trackName: element.track.name,
					trackArtists: element.track.artists.map(
						(trackArtist: any): ArtistData => {
							const artists = {
								id: trackArtist.id,
								name: trackArtist.name,
								popularity: trackArtist.popularity,
								artistURI: trackArtist.uri,
							};

							return artists;
						}
					),
					albumType: element.track.album.album_type,
					albumName: element.track.album.name,
					albumReleaseDate: element.track.album.release_date,
					albumArtists: element.track.album.artists.map(
						(albumArtist: any): ArtistData => {
							const artists = {
								id: albumArtist.id,
								name: albumArtist.name,
								popularity: null,
								artistURI: albumArtist.uri,
							};
							return artists;
						}
					),
					popularity: element.track.popularity,
					// trackURI: element.track.uri,
					trackURI:
						"http://open.spotify.com/track/" + element.track.id,
				};
				return items;
			}),
		};

		console.log("Clean Song Data:");
		console.log(cleanData);
		// return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getPlaylistTracks: " + error.message + error.name
			);
		}
	}
	try {
		if (!cleanData) throw new Error("Clean data is undefined");
		// There are tracks that exist in next
		// we need to keep going and do fetch req until next is null
		// the return value from recursive calls should update the clean data every return
		// The final return should have a proper array of items, next should be null
		if (cleanData.next != null) {
			if (apiCallCount > 10) return cleanData;

			console.log("Next is: " + cleanData.next);
			console.log("Recursing...");
			const nextData = await getPlaylistTracks(
				playlistID,
				(next = cleanData.next)
			);

			console.log("NextData from recursion: ");
			console.log(nextData);
			cleanData.next = nextData?.next;
			Array.prototype.push.apply(cleanData.items, nextData?.items!);
			console.log("Concatinated Data from recursion: ");
			console.log(cleanData);
		}

		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getPlaylistTracks recursion: " +
					error.message +
					error.name
			);
		}
	}

	return cleanData;
}

// export class SpotifyWebApi {
// 	static baseUri = "https://api.spotify.com";

// 	static async getUserProfile() {
// 		"use server";

// 		const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

// 		try {
// 			if (!accessToken) {
// 				throw new Error("Access token not set");
// 			}
// 			const response = await fetch(this.baseUri + "/v1/me", {
// 				headers: {
// 					Authorization: "Bearer " + accessToken,
// 				},
// 			});
// 			const data = await response.json();
// 			console.log(data);
// 			return data;
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				console.log("Fetch Error getUserPofile: " + error.message);
// 			}
// 		}
// 	}

// 	// Get current user's playlists, limit of 50, starts at 0
// 	// Should check if there are more than 50, if so update offset and recall the method
// 	// Should concatinate the new data into one JSON obj and return
// 	static async getUserPlaylists(
// 		next: string | null = null
// 	): Promise<PlaylistData | undefined> {
// 		const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

// 		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!API CALL!!!!!!!!!!!!!!!!!!!!!!!");
// 		// console.log("Next is: " + next + " type: " + typeof next);
// 		try {
// 			if (!accessToken) {
// 				throw new Error("Access token not set");
// 			}

// 			let response;

// 			if (next == null) {
// 				console.log("Next is Null!");
// 				response = await fetch(
// 					this.baseUri + `/v1/me/playlists?limit=50&offset=0`,
// 					{
// 						headers: {
// 							Authorization: "Bearer " + accessToken,
// 						},
// 					}
// 				);
// 			} else {
// 				console.log("Next not null");
// 				response = await fetch(next, {
// 					headers: {
// 						Authorization: "Bearer " + accessToken,
// 					},
// 				});
// 			}
// 			if (response.status != 200) {
// 				console.log(response.status);
// 				console.log(response.headers);
// 				throw new Error(response.statusText);
// 			}
// 			const data = await response.json();

// 			// console.log(data);
// 			console.log("Total Playlists: " + data.total);

// 			const cleanData = {
// 				next: data.next,
// 				total: data.total,
// 				items: data.items.map((element: any) => {
// 					const items = {
// 						name: element.name,
// 						description: element.description,
// 						id: element.id,
// 						track_href: element.tracks.href,
// 						track_total: element.tracks.total,
// 					};
// 					return items;
// 				}),
// 			};

// 			console.log("Clean Data:");
// 			console.log(cleanData);
// 			return cleanData;
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				console.log(
// 					"Fetch Error getUserPlaylists: " +
// 						error.message +
// 						error.name
// 				);
// 			}
// 		}

// 		// try {
// 		// 	if (!cleanData) throw new Error("Clean data is undefined");
// 		// 	// There are tracks that exist in next
// 		// 	// we need to keep going and do fetch req until next is null
// 		// 	// the return value from recursive calls should update the clean data every return
// 		// 	// The final return should have a proper array of items, next should be null
// 		// 	if (cleanData.next != null) {
// 		// 		console.log("Next is: " + cleanData.next);
// 		// 		console.log("Recursing...");
// 		// 		const nextData = await this.getUserPlaylists(
// 		// 			(next = cleanData.next)
// 		// 		);

// 		// 		console.log("NextData from recursion: ");
// 		// 		console.log(nextData);
// 		// 		// TODO: Concat nextData and cleanData
// 		// 	}

// 		// 	return cleanData;
// 		// } catch (error: unknown) {
// 		// 	if (error instanceof Error) {
// 		// 		console.log(
// 		// 			"Fetch Error getUserPlaylists: " +
// 		// 				error.message +
// 		// 				error.name
// 		// 		);
// 		// 	}
// 		// }
// 	}

// 	static getCleanData(data: any) {
// 		const cleanData = {
// 			next: data.next,
// 			total: data.total,
// 			items: data.items.map((element: any) => {
// 				const items = {
// 					name: element.name,
// 					description: element.description,
// 					id: element.id,
// 					track_href: element.tracks.href,
// 					track_total: element.tracks.total,
// 				};
// 				return items;
// 			}),
// 		};

// 		return cleanData;
// 	}

// 	static async getPlaylistTracks(playlistId: string) {}
// }
