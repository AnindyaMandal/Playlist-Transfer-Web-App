"use client";
import React from "react";
import { PlaylistItem } from "@/app/definitions/PlaylistItem";
import { PlaylistData } from "@/app/definitions/PlaylistData";

// function SpotifyPlaylistItem(props: { name: string; trackCount: number }) {
function SpotifyPlaylistItem(props: {
	item: PlaylistItem;
	handleOnClick: Function;
	playlistID: string;
}) {
	return (
		<div className="w-full mb-2">
			<button
				className="w-full spotify_playlist_li  mr-2"
				onClick={() => {
					props.handleOnClick(props.playlistID, props.item.name);
				}}
			>
				<h2>{props.item.name}</h2>
				<h4>Tracks: {props.item.track_total}</h4>
			</button>
		</div>
	);
}

export default SpotifyPlaylistItem;
