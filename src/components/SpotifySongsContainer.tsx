import React from "react";
import SpotifySongItem from "./SpotifySongItem";
import { TrackData } from "@/app/definitions/TrackData";
import { TrackItem } from "@/app/definitions/TrackItem";

const SpotifySongsContainer = (props: { trackData: TrackData }) => {
	return (
		<div>
			<ul>
				{props.trackData ? (
					props.trackData.items.map((trackItem: TrackItem) => {
						return (
							<li
								key={
									trackItem.trackID +
									props.trackData.playlistID
								}
							>
								<SpotifySongItem
									// name={item.name}
									// trackCount={item.track_total}
									track={trackItem}
								/>
							</li>
						);
					})
				) : (
					<h1>No Song data!</h1>
				)}
			</ul>
		</div>
	);
};

export default SpotifySongsContainer;
