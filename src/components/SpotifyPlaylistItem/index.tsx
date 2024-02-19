import React from "react";
import { PlaylistItem } from "@/app/definitions/PlaylistItem";
import { PlaylistData } from "@/app/definitions/PlaylistData";

// function SpotifyPlaylistItem(props: { name: string; trackCount: number }) {
function SpotifyPlaylistItem(props: { item: PlaylistItem }) {
	return (
		<div className="spotify_playlist_li">
			<h2>{props.item.name}</h2>
			<h4>Tracks: {props.item.track_total}</h4>
		</div>
	);
}

export default SpotifyPlaylistItem;
