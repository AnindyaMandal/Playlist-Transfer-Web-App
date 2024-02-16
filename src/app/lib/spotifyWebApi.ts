export class SpotifyWebApi {
	static baseUri = "https://api.spotify.com";

	static async getUserProfile() {
		const accessToken = process.env.ACCESS_TOKEN;

		try {
			if (!accessToken) {
				throw new Error("Access token not set");
			}
			const response = await fetch(this.baseUri + "/v1/me", {
				headers: {
					Authorization: "Bearer " + accessToken,
				},
			});
			const data = await response.json();
			console.log(data);
			return data;
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log("Fetch Error getUserPofile: " + error.message);
			}
		}
	}

	// Get current user's playlists, limit of 50, starts at 0
	// Should check if there are more than 50, if so update offset and recall the method
	// Should concatinate the new data into one JSON obj and return
	static async getUserPlaylists(next: string = "") {
		const accessToken = process.env.ACCESS_TOKEN;
		try {
			if (!accessToken) {
				throw new Error("Access token not set");
			}

			let response;

			if (next === "") {
				response = await fetch(
					this.baseUri + `/v1/me/playlists?limit=50&offset=0`,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
						},
					}
				);
			} else {
				response = await fetch(
					this.baseUri + `/v1/me/playlists?${next}`,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
						},
					}
				);
			}

			const data = await response.json();

			if (data.next !== null) {
			}

			console.log(data);
			console.log("Total Playlists: " + data.total);

			const cleanData = {
				next: data.next,
				total: data.total,
				items: [
					data.items.forEach((element: any) => {
						const items = {
							name: element.name,
							description: element.description,
							id: element.id,
							track_href: element.tracks.href,
							track_total: element.tracks.total,
							images: element.images,
						};
						return items;
					}),
				],
			};

			console.log("Clean Data:");
			console.log(cleanData);

			return data;
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log("Fetch Error getUserPlaylists: " + error.message);
			}
		}
	}

	static async getPlaylistTracks(playlistId: string) {}
}
