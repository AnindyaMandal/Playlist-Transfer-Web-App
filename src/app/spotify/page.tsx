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

const sessionStorageKeys = {
	userPlaylistData: "userPlaylistSessionData",
	playlistTrackData: "playlistTrackData",
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

	// Handle click for Get user playlists
	// Gets playlist data or undefined from Spotify API
	// Sets state variable for re-render
	// Stores data to Session Storage
	const handleClick = async () => {
		console.log("Handling click!");
		const endpointData = await getUserPlaylists();

		if (endpointData !== undefined) {
			console.log("JSON PLaylist Data:");
			console.log(endpointData);
			setPlaylistData(endpointData);

			storeToSessionStorage(
				JSON.stringify(endpointData),
				sessionStorageKeys.playlistTrackData
			);
		}
	};

	// "userPlaylistSessionData" KEY for playlist Data
	// ""
	function storeToSessionStorage(data: string, key: string) {
		window.sessionStorage.setItem(key, data);
	}

	function getFromSessionStorage(key: string) {
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

	// Handle clicking on a playlist item
	// Gets TrackData for playlist clicked
	// Sets state variable for rendering list of tracks
	// Sets state variable showing currently selected playlist
	// Stores data into session storage
	//
	//
	// TODO:
	// Store data into session storage
	// Check if data exists for playlist in session storage
	// If so get that data and show to use
	// Should find out way to store when data was acquired to give the user option to refresh
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

			// Store all track data for selected playlist
			// Key is constant defined at the top + playlistID for unique key per playlist
			storeToSessionStorage(
				JSON.stringify(endpointData),
				sessionStorageKeys.playlistTrackData + playlistID
			);
		} else {
			setSelectedPlaylistTag("No Playlist Selected!");
		}
	}

	useEffect(() => {
		console.log("USE EFFECT!");
		// Get playlist session data from storage
		setPlaylistData(getFromSessionStorage("playlistSessionData"));
	}, []);

	return (
		<div>
			<div className="flex flex-col w-full ml-2">
				<h1 className="text-center w-5/12">SPOTIFY</h1>
				<div className="w-5/12 ">
					<Link href="/api/auth/signin/spotify">
						<button
							type="button"
							className="spotify_auth_btn w-full"
						>
							Authenticate
						</button>
					</Link>
				</div>

				<div className="w-5/12">
					<button
						type="button"
						className="spotify_auth_btn w-full"
						onClick={() => handleClick()}
					>
						Get User Playlists
					</button>
				</div>
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

			<div className="flex flex-row ml-2">
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
						<h2>
							{selectedPlaylistTag != "No playlist Selected" ? (
								<h1>SONG DATA ERROR</h1>
							) : (
								<></>
							)}
						</h2>
					)}
				</div>
			</div>
		</div>
	);
}

export default SpotifyPage;
