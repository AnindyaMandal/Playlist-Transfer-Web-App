"use client";
import React from "react";
import SpotifySongItem from "./SpotifySongItem";
import { TrackData } from "@/app/definitions/TrackData";
import { TrackItem } from "@/app/definitions/TrackItem";
import { Button } from "./ui/button";
import { ArtistData } from "@/app/definitions/ArtistData";

const SpotifySongsContainer = (props: {
	trackData: TrackData;
	handleOnClick: Function;
}) => {
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
									<Button
										className="border-2 border-red-600"
										onClick={() => {
											const artists =
												trackItem.trackArtists.map(
													(artist: ArtistData) => {
														return artist.name;
													}
												);
											props.handleOnClick(
												trackItem.trackName,
												trackItem.trackName +
													" " +
													artists.join(" ")
											);
										}}
									>
										YT Search
									</Button>
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
