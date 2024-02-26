"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { options } from "../api/auth/[...nextauth]/options";
// import { SpotifyWebApi } from "../lib/spotifyWebApi";
import { getPlaylistTracks, getUserPlaylists } from "../lib/spotifyWebApi";
import { getServerSession } from "next-auth";

import SpotifyPlaylistContainer from "@/components/SpotifyPlaylistContainer";
import getSampleData from "../lib/sampleFile";
import SpotifySongsContainer from "@/components/SpotifySongsContainer";

const getPlaylistData = async () => {
	console.log("Getting playlist data...");
	const response = await getUserPlaylists();
	// const response = getSampleData();
	return response;
};

function SpotifyPage() {
	// const session = await getServerSession(options);
	// const playlistData = await SpotifyWebApi.getUserPlaylists();

	const [playlistData, setPlaylistData] = useState<any>(null);
	const [selectedPlaylistSongs, setSelectedPlaylistSongs] =
		useState<any>(null);

	const [selectedPlaylistTag, setSelectedPlaylistTag] = useState<string>(
		"No playlist Selected"
	);

	const handleClick = async () => {
		console.log("Handling click!");
		const endpointData = await getUserPlaylists();

		if (endpointData !== undefined) {
			console.log("JSON PLaylist Data:");
			console.log(endpointData);
			setPlaylistData(endpointData);

			storeToSessionStorage(JSON.stringify(endpointData));
		}
	};

	function storeToSessionStorage(
		data: string,
		key: string = "playlistSessionData"
	) {
		window.sessionStorage.setItem(key, data);
	}

	function getFromSessionStorage(key: string = "playlistSessionData") {
		if (window) {
			const data = window?.sessionStorage.getItem(key);
			if (data == undefined || null) {
				console.log("Data: " + data);

				return null;
			}
			const jsonData = JSON.parse(data);
			console.log(typeof jsonData);
			console.log("jsonData: " + jsonData);
			return jsonData;
		}
	}

	async function handlePlaylistClick(
		playlistID: string,
		playlistName: string
	) {
		console.log("Getting Songs for: " + playlistID);
		const endpointData = await getPlaylistTracks(playlistID);
		console.log("Endpoint Data: " + typeof endpointData);
		console.log(endpointData);

		if (endpointData !== undefined) {
			setSelectedPlaylistSongs(endpointData);
			setSelectedPlaylistTag(playlistName);
		} else {
			setSelectedPlaylistTag("No Playlist Selected!");
		}
	}

	useEffect(() => {
		console.log("USE EFFECT!");
		setPlaylistData(getFromSessionStorage());
	}, []);

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

			<div className="flex flex-row ">
				<div className="w-5/12">
					<div className="w-full items-center">
						<h2 className="w-full text-center">
							User&apos;s Playlists:
						</h2>
					</div>
					{playlistData ? (
						<SpotifyPlaylistContainer
							playlistData={playlistData}
							handleOnClick={handlePlaylistClick}
						></SpotifyPlaylistContainer>
					) : (
						<h1>No playlist data available!</h1>
					)}
				</div>

				<div className="ml-2 w-5/12">
					<h2 className="w-full text-center">
						Selected Playlist: {selectedPlaylistTag}
					</h2>
					{selectedPlaylistSongs ? (
						<SpotifySongsContainer
							trackData={selectedPlaylistSongs}
						></SpotifySongsContainer>
					) : (
						<h2>Song Data Error</h2>
					)}
				</div>
			</div>
		</div>
	);
}

export default SpotifyPage;
