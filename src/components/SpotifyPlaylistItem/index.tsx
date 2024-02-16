import React from "react";

function SpotifyPlaylistItem({ data }: any) {
	return (
		<div className="spotify_playlist_li">
			<h2>{data.name}</h2>
			<h4>Tracks: {data.tracks.total}</h4>
		</div>
	);
}

export default SpotifyPlaylistItem;
