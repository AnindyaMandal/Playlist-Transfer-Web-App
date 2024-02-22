import React from "react";
import SpotifyPlaylistContainer from "./SpotifyPlaylistContainer";
import { PlaylistData } from "@/app/definitions/PlaylistData";
import { PlaylistItem } from "@/app/definitions/PlaylistItem";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import getSampleData from "@/app/lib/sampleFile";
import { getUserPlaylists } from "@/app/lib/spotifyWebApi";
// import { SpotifyWebApi } from "@/app/lib/spotifyWebApi";

async function SpotifyDataFetcher(props: { getData: boolean }) {
	const session = await getServerSession(options);
	const playlistData = props.getData ? await getUserPlaylists() : undefined;
	return (
		<div>
			{session ? (
				<div>
					<h1>Hello: {session.user?.name}</h1>
					<SpotifyPlaylistContainer
						playlistData={playlistData}
					></SpotifyPlaylistContainer>
				</div>
			) : (
				<h1>No session!</h1>
			)}
		</div>
	);
}

export default SpotifyDataFetcher;
