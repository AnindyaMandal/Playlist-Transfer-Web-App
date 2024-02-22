"use server";
import { PlaylistData } from "../definitions/PlaylistData";

export async function getUserPlaylists(
	next: string | null = null
): Promise<PlaylistData | undefined> {
	const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
	const baseUri = "https://api.spotify.com";

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!API CALL!!!!!!!!!!!!!!!!!!!!!!!");
	// console.log("Next is: " + next + " type: " + typeof next);
	try {
		if (!accessToken) {
			throw new Error("Access token not set");
		}

		let response;

		if (next == null) {
			console.log("Next is Null!");
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
			response = await fetch(next, {
				headers: {
					Authorization: "Bearer " + accessToken,
				},
			});
		}
		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		const data = await response.json();

		// console.log(data);
		console.log("Total Playlists: " + data.total);

		const cleanData = {
			next: data.next,
			total: data.total,
			items: data.items.map((element: any) => {
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

		console.log("Clean Data:");
		console.log(cleanData);
		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getUserPlaylists: " + error.message + error.name
			);
		}
	}
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
