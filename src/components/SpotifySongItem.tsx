import React from "react";
import { TrackItem } from "@/app/definitions/TrackItem";
function SpotifySongItem(props: { track: TrackItem }) {
	console.log(props.track.trackName);
	return (
		<div>
			<a
				href={props.track.trackURI}
				className="spotify_playlist_li w-full"
			>
				<h2>{props.track.trackName}</h2>
				{/* <h4>Artists: {props.track.trackArtists.join(" & ")}</h4> */}
				<h4>Album: {props.track.albumName}</h4>
			</a>
		</div>
	);
}

export default SpotifySongItem;
