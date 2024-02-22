import React from "react";

function SpotifySongItem() {
	return (
		<div className="spotify_playlist_li">
			<h2>{props.item.name}</h2>
			<h4>Tracks: {props.item.track_total}</h4>
		</div>
	);
}

export default SpotifySongItem;
