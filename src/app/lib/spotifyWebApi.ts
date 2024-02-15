export class SpotifyWebApi {
	spotifyUrl = "https://api.spotify.com/v1/me";
	baseUri = "https://api.spotify.com";
	async getUserProfile() {
		const accessToken = process.env.ACCESS_TOKEN;
		if (!accessToken) {
			throw new Error("Access token not set");
		}
		try {
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
}
