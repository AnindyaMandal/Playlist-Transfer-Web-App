"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getPlaylistTracks, getUserPlaylists } from "../lib/spotifyWebApi";

import SpotifyPlaylistContainer from "@/components/SpotifyPlaylistContainer";
// import getSampleData from "../lib/sampleFile";
import SpotifySongsContainer from "@/components/SpotifySongsContainer";

import { searchTrackYT } from "../lib/ytWebApi";
import { TrackItem } from "../definitions/TrackItem";
import { TrackData } from "../definitions/TrackData";
import { ArtistData } from "../definitions/ArtistData";
import {
	mongoAddSongData,
	mongoFindSongExists,
} from "../lib/actions/song.actions";

// const getPlaylistData = async () => {
// 	console.log("Getting playlist data...");
// 	const response = await getUserPlaylists();
// 	// const response = getSampleData();
// 	return response;
// };

const sessionStorageKeys = {
	userPlaylistData: "userPlaylistSessionData",
	playlistTrackData: "playlistTrackData",
};

function SpotifyPage() {
	// const playlistData = await SpotifyWebApi.getUserPlaylists();

	const [youtubeData, setYoutubeData] = useState<any>(null);
	const [playlistData, setPlaylistData] = useState<any>(null);
	const [selectedPlaylistSongs, setSelectedPlaylistSongs] =
		useState<any>(null);

	const [selectedPlaylistTag, setSelectedPlaylistTag] = useState<string>(
		"No playlist Selected"
	);

	const [selectedPlaylistID, setSelectedPlaylistID] = useState<string>("");

	// Get local cookie value, defaults to sessionID cookie
	// Unused, maybe remove
	const getCookieValue = (name: string = "sessionID") =>
		document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() ||
		"";

	function storeToSessionStorage(data: string, key: string) {
		window.sessionStorage.setItem(key, data);
	}

	function getFromSessionStorage(key: string) {
		if (window) {
			const data = window?.sessionStorage.getItem(key);
			if (data == undefined || null) {
				console.log("GetSessionStorage Data null: " + data);

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
	// Store data into session storage
	// Check if data exists for playlist in session storage
	// If so get that data and show to use
	//
	//
	// TODO:
	// Should find out way to store when data was acquired to give the user option to refresh
	async function handlePlaylistClick(
		playlistID: string,
		playlistName: string,
		refreshData: boolean = false
	) {
		const data = getFromSessionStorage(
			sessionStorageKeys.playlistTrackData + playlistID
		);

		if (data != undefined && data != null && refreshData == false) {
			console.log(
				"Session storage data for: " + playlistID + " Data: " + data
			);

			console.log(selectedPlaylistID);
			setSelectedPlaylistID(playlistID);
			setSelectedPlaylistSongs(data);
			setSelectedPlaylistTag(playlistName);

			return;
		}

		console.log("Getting Songs for: " + playlistID);
		const endpointData = await getPlaylistTracks(playlistID);
		console.log("Endpoint Data: " + typeof endpointData);
		console.log(endpointData);

		if (endpointData !== undefined) {
			console.log(selectedPlaylistID);
			setSelectedPlaylistID(playlistID);

			setSelectedPlaylistSongs(endpointData);
			setSelectedPlaylistTag(playlistName);

			// Store all track data for selected playlist
			// Key is constant defined at the top + playlistID for unique key per playlist
			storeToSessionStorage(
				JSON.stringify(endpointData),
				sessionStorageKeys.playlistTrackData + playlistID
			);
		} else {
			setSelectedPlaylistID("");

			setSelectedPlaylistTag("No Playlist Selected!");
		}
	}

	// Handle click for Get user playlists
	// Gets playlist data or undefined from Spotify API
	// Sets state variable for re-render
	// Stores data to Session Storage
	const handleGetUserPlaylistsClick = async () => {
		console.log("Handling click!");
		const endpointData = await getUserPlaylists();

		if (endpointData !== undefined) {
			console.log("JSON PLaylist Data:");
			console.log(endpointData);

			if ("errMsg" in endpointData) {
				console.log("Found error while getting user playlists");
				alert(endpointData.errMsg);
				return;
			}
			setPlaylistData(endpointData);

			storeToSessionStorage(
				JSON.stringify(endpointData),
				sessionStorageKeys.userPlaylistData
			);
		}
	};

	// Handle click to Save playlist data on pc
	// downloads playlist data as JSON
	const handleSaveToPC = (playlistID: string, playlistName: string) => {
		const fileData = JSON.stringify(
			getFromSessionStorage(
				sessionStorageKeys.playlistTrackData + playlistID
			)
		);
		const blob = new Blob([fileData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = `${playlistName}_track_data.json`;
		link.href = url;
		link.click();
	};

	// Searches all songs in a playlist on YouTube
	// Finds best fit links and updates the useState variable
	// This reflects changes on DOM to show YouTube Hyperlink
	const handleYouTubeSearchPList = async () => {
		// const localPlaylistSongs = { ...selectedPlaylistSongs };
		const localPlaylistSongs: TrackData = JSON.parse(
			JSON.stringify(selectedPlaylistSongs)
		);

		// Some issue with forEach and ASYNC it behaves unexpectedly
		// Code here for reference
		/*
		localPlaylistSongs.items.forEach(async (trackItem: TrackItem) => {
			const artists = trackItem.trackArtists.map((artist: ArtistData) => {
				return artist.name;
			});
			let query = trackItem.trackName + " " + artists.join(" ");
			const endpointData = await searchTrackYT(query);
			if (endpointData !== undefined) {
				console.log("JSON YT Data:");
				console.log(endpointData);
				trackItem.ytURI = endpointData;
			} else {
				console.log("Something went wrong fetching YT playlist data");
			}
		});
		*/

		for (let trackItem of localPlaylistSongs.items) {
			if (
				trackItem.trackName == "" ||
				trackItem.trackName == null ||
				trackItem.trackName == undefined
			) {
				console.error(
					"handleYouTubeSearchPlist() No trackname for track ID: " +
						trackItem.trackID
				);

				continue;
			}

			// mongofindsongexists returns false when nothing found or the URI to the song
			let foundYtURI = await mongoFindSongExists(trackItem);
			if (foundYtURI !== false) {
				console.log(
					"Found existing YouTube URI for " + trackItem.trackName
				);
				trackItem.ytURI = foundYtURI;
				continue;
			}
			console.log(
				"\n\tNo existing MongoDB entry for " + trackItem.trackName
			);
			let artists = trackItem.trackArtists.map((artist: ArtistData) => {
				return artist.name;
			});
			let query = trackItem.trackName + " " + artists.join(" ");
			console.log("YT QUERY SEARCH: " + query);
			let endpointData = await searchTrackYT(query);

			if (endpointData !== undefined) {
				console.log("JSON YT Data:");
				console.log(endpointData);
				trackItem.ytURI = endpointData;
				mongoAddSongData(trackItem);
			} else {
				console.log("Something went wrong fetching YT playlist data");
			}
		}
		console.log("Done searching YT!");
		console.log(localPlaylistSongs);
		storeToSessionStorage(
			JSON.stringify(localPlaylistSongs),
			sessionStorageKeys.playlistTrackData + localPlaylistSongs.playlistID
		);
		setSelectedPlaylistSongs(localPlaylistSongs);
	};

	// TODO:
	// REMOVE NOT USED ANYMORE
	// REMEMBER TO REMOVE THE UGLY BUTTONS FOR GETTING EACH SONG AS WELL
	// COULD BE REVAMPED AS A TEST FUNC
	const handleYTdataClick = async (trackName: string, query: string) => {
		const endpointData = await searchTrackYT(query);
		console.log("HANDING YT CLICK \t SONG: " + trackName);
		console.log("SEARCH QUERY: " + query);

		if (endpointData !== undefined) {
			console.log("JSON YT Data:");
			console.log(endpointData);
			setYoutubeData(endpointData);

			storeToSessionStorage(
				JSON.stringify(endpointData),
				trackName + "_YT_data"
			);
		} else {
			console.log("Something went wrong fetching YT data");
		}
	};

	useEffect(() => {
		console.log("USE EFFECT!");
		// Get playlist session data from storage
		setPlaylistData(
			getFromSessionStorage(sessionStorageKeys.userPlaylistData)
		);
	}, []);

	return (
		<div>
			<div className="flex flex-row w-full ml-2">
				<div className="flex flex-col w-full ml-2 items-center">
					<div className="w-9/12">
						<Link href="/api/auth/signin/spotify">
							<button
								type="button"
								className="spotify_auth_btn w-full"
							>
								Authenticate
							</button>
						</Link>
					</div>
					<div className="w-9/12">
						<button
							type="button"
							className="spotify_auth_btn w-full"
							onClick={() => handleGetUserPlaylistsClick()}
						>
							Get User Playlists
						</button>
					</div>
					<div className="w-9/12">
						<button
							type="button"
							className="spotify_auth_btn w-full"
							onClick={() => {
								console.log("Refresh playlist...");
								console.log(selectedPlaylistID);
								if (
									selectedPlaylistID !== "" &&
									selectedPlaylistTag !==
										"No Playlist Selected!"
								) {
									handleSaveToPC(
										selectedPlaylistID,
										selectedPlaylistTag
									);
								}
							}}
						>
							Download Current Playlist Data
						</button>
					</div>
				</div>
				<div className="flex flex-col w-full items-center">
					<div className="w-9/12">
						<button
							type="button"
							className="spotify_auth_btn w-full"
							onClick={() => {
								console.log("Refresh playlist...");
								console.log(selectedPlaylistID);
								if (
									selectedPlaylistID !== "" &&
									selectedPlaylistTag !==
										"No Playlist Selected!"
								) {
									handlePlaylistClick(
										selectedPlaylistID,
										selectedPlaylistTag,
										true
									);
								}
							}}
						>
							Refresh Song List
						</button>
					</div>
					{selectedPlaylistID !== "" &&
					selectedPlaylistTag !== "No Playlist Selected!" ? (
						<div className="w-9/12">
							<button
								type="button"
								className="youtube_auth_btn w-full"
								onClick={() => {
									console.log(
										"Getting YT links for playlist..."
									);
									console.log(selectedPlaylistID);
									if (
										selectedPlaylistID !== "" &&
										selectedPlaylistTag !==
											"No Playlist Selected!"
									) {
										handleYouTubeSearchPList();
									}
								}}
							>
								YouTube Current Playlist
							</button>
						</div>
					) : null}
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

			<div className="flex flex-row ml-2 justify-around">
				<div className="w-5/12">
					<div className="w-full items-center">
						<h2 className="w-full text-center mt-2 mb-2">
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
					<h2 className="w-full text-center mt-2 mb-2">
						Selected Playlist: {selectedPlaylistTag}
					</h2>
					{selectedPlaylistSongs ? (
						<SpotifySongsContainer
							trackData={selectedPlaylistSongs}
							handleOnClick={handleYTdataClick}
						></SpotifySongsContainer>
					) : (
						<div>
							{selectedPlaylistTag != "No Playlist Selected!" ? (
								<h1>Please select a playlist</h1>
							) : (
								<h1></h1>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default SpotifyPage;
