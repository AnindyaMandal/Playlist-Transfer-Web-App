"use client";
import Link from "next/link";
import React, { useState } from "react";
import { options } from "../api/auth/[...nextauth]/options";
// import { SpotifyWebApi } from "../lib/spotifyWebApi";
import { getUserPlaylists } from "../lib/spotifyWebApi";
import { getServerSession } from "next-auth";

import SpotifyPlaylistContainer from "@/components/SpotifyPlaylistContainer";
import getSampleData from "../lib/sampleFile";

const getPlaylistData = async () => {
	console.log("Getting playlist data...");
	const response = await getUserPlaylists();
	// const response = getSampleData();
	return response;
};

function SpotifyPage() {
	// const session = await getServerSession(options);
	// const playlistData = await SpotifyWebApi.getUserPlaylists();

	const [playlistData, setPlaylistData] = useState<any>(
		getFromSessionStorage()
	);

	// const [showData, setShowData] = useState<boolean>(false);

	const handleClick = async () => {
		console.log("Handling click!");
		const endpointData = await getUserPlaylists();
		setPlaylistData(endpointData);
		// setShowData(true);
		storeToSessionStorage(JSON.stringify(endpointData));
	};

	function storeToSessionStorage(
		data: string,
		key: string = "playlistSessionData"
	) {
		window.sessionStorage.setItem(key, data);
	}

	function getFromSessionStorage(key: string = "playlistSessionData") {
		const data = window.sessionStorage.getItem(key);
		if (!data) {
			const jsonData = {
				next: null,
				total: 0,
				items: [],
			};
			return jsonData;
		}
		const jsonData = JSON.parse(data);
		return jsonData;
	}

	return (
		<div>
			<div>
				<h1>SPOTIFY</h1>
				<Link href="/api/auth/signin/spotify">
					<button type="button" className="spotify_auth_btn">
						Authenticate
					</button>
				</Link>
				<button
					type="button"
					className="spotify_auth_btn"
					onClick={() => handleClick()}
				>
					Get User Playlists
				</button>
			</div>
			{/* {session ? (
				// <ul>
				// 	{playlistData.items.map((item: PlaylistItem) => {
				// 		return (
				// 			<li key={item.id}>
				// 				<SpotifyPlaylistItem item={item} />
				// 			</li>
				// 		);
				// 	})}
				// </ul>
				<h1>Hello: {session.user?.name}</h1>
			) : (
				<h1>No session!</h1>
			)} */}
			{/* {showData && playlistData ? ( */}
			{playlistData ? (
				<SpotifyPlaylistContainer
					playlistData={playlistData}
				></SpotifyPlaylistContainer>
			) : (
				// <h1>{showData}</h1>
				<h1>No playlist data available!</h1>
			)}
		</div>
	);
}

export default SpotifyPage;
