import React from "react";
import { PlaylistData } from "@/app/definitions/PlaylistData";
import { PlaylistItem } from "@/app/definitions/PlaylistItem";
import SpotifyPlaylistItem from "./SpotifyPlaylistItem";

const SpotifyPlaylistContainer = (props: {
	playlistData: PlaylistData | undefined;
	handleOnClick: Function;
}) => {
	console.log(props);
	return (
		<div>
			<ul>
				{props.playlistData ? (
					props.playlistData.items.map((item: PlaylistItem) => {
						return (
							<li key={item.id}>
								<SpotifyPlaylistItem
									item={item}
									playlistID={item.id}
									handleOnClick={props.handleOnClick}
								/>
							</li>
						);
					})
				) : (
					<div className="spotify_playlist_li">
						<h1>No Playlist data!</h1>
					</div>
				)}
			</ul>
		</div>
	);
};

export default SpotifyPlaylistContainer;
