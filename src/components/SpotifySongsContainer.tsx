import React from "react";
import SpotifySongItem from "./SpotifySongItem";
import { TrackData } from "@/app/definitions/TrackData";
import { TrackItem } from "@/app/definitions/TrackItem";

const SpotifySongsContainer = (props: { trackData: TrackData }) => {
	let count = 0;
	return (
		<div>
			<ul>
				{props.trackData ? (
					props.trackData.items.map((trackItem: TrackItem) => {
						count += 1;
						return (
							<li
								key={
									trackItem.trackID +
									props.trackData.playlistID +
									count
								}
							>
								<div className="flex flex-row ">
									<h4 className="spotify_playlist_li w-1/12 mb-2">
										{count}.
									</h4>
									<SpotifySongItem
										// name={item.name}
										// trackCount={item.track_total}
										track={trackItem}
									/>
								</div>
							</li>
						);
					})
				) : (
					<></>
				)}
			</ul>
		</div>
	);
};

export default SpotifySongsContainer;
