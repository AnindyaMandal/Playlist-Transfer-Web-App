import React from "react";
import { TrackItem } from "@/app/definitions/TrackItem";
import { ArtistData } from "@/app/definitions/ArtistData";
function SpotifySongItem(props: { track: TrackItem }) {
	return (
		<div className="w-full mb-2">
			<a
				href={props.track.trackURI}
				target="_blank"
				className="spotify_playlist_li "
			>
				<div>
					<h1>{props.track.trackName}</h1>
					<h4>Album: {props.track.albumName}</h4>

					<h4>
						Artists:{" "}
						{props.track.trackArtists
							.map((artist: ArtistData) => {
								return artist.name;
							})
							.join(" & ")}
					</h4>
				</div>
				<div>
					<h4>Released: {props.track.albumReleaseDate}</h4>
					<h4>{props.track.albumType}</h4>
					<h4>Popularity: {props.track.popularity}</h4>
				</div>
				{/* <h4>Artists: {props.track.trackArtists.join(" & ")}</h4> */}
			</a>
		</div>
	);
}

export default SpotifySongItem;
