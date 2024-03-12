import React from "react";
import { TrackItem } from "@/app/definitions/TrackItem";
import { ArtistData } from "@/app/definitions/ArtistData";
function SpotifySongItem(props: { track: TrackItem }) {
	const artists = props.track.trackArtists.map((artist: ArtistData) => {
		return artist.name;
	});
	console.log(props.track.trackName);
	console.log("\tYT URI:" + props.track.ytURI);
	return (
		<div className="w-full mb-2 spotify_playlist_li">
			{/* <a
				href={props.track.trackURI}
				target="_blank"
				className="spotify_playlist_li "
			> */}
			<div>
				<h1>{props.track.trackName}</h1>
				<h4>Album: {props.track.albumName}</h4>

				<h4>
					Artists:{" "}
					{/* {props.track.trackArtists
							.map((artist: ArtistData) => {
								return artist.name;
							})
							.join(" & ")} */}
					{artists.join(" & ")}
				</h4>
			</div>
			<div className="flex flex-col justify-between">
				<a href={props.track.trackURI} target="_blank">
					Spotify
				</a>
				{props.track.ytURI !== "" ? (
					<a href={props.track.ytURI} target="_blank">
						YouTube
					</a>
				) : null}
			</div>
			<div>
				<h4>Released: {props.track.albumReleaseDate}</h4>
				<h4>{props.track.albumType}</h4>
				<h4>Popularity: {props.track.popularity}</h4>
			</div>
			{/* <h4>Artists: {props.track.trackArtists.join(" & ")}</h4> */}
			{/* </a> */}
		</div>
	);
}

export default SpotifySongItem;
