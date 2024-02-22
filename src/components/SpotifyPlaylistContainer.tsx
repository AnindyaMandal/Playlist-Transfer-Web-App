import React from "react";
import { PlaylistData } from "@/app/definitions/PlaylistData";
import { PlaylistItem } from "@/app/definitions/PlaylistItem";
import SpotifyPlaylistItem from "./SpotifyPlaylistItem";

const SpotifyPlaylistContainer = (props: {
	playlistData: PlaylistData | undefined;
}) => {
	return (
		<div>
			<ul>
				{props.playlistData ? (
					props.playlistData.items.map((item: PlaylistItem) => {
						return (
							<li key={item.id}>
								<SpotifyPlaylistItem
									// name={item.name}
									// trackCount={item.track_total}
									item={item}
								/>
							</li>
						);
					})
				) : (
					<h1>No Playlist data!</h1>
				)}
			</ul>
		</div>
	);
};

export default SpotifyPlaylistContainer;
