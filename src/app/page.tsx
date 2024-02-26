import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
// import { SpotifyWebApi } from "./lib/spotifyWebApi";
import { getUserPlaylists } from "./lib/spotifyWebApi";

import SpotifyPlaylistItem from "@/components/SpotifyPlaylistItem";
import { PlaylistItem } from "./definitions/PlaylistItem";
import getSampleData from "./lib/sampleFile";

export default async function Home() {
	const session = await getServerSession(options);
	// const profileData = await SpotifyWebApi.getUserProfile();
	// const playlistData = await SpotifyWebApi.getUserPlaylists();

	// DISABLED API CALL FOR NOW

	const playlistData = await getSampleData();

	return (
		<>
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<pre>{JSON.stringify(playlistData, null, 2)}</pre>

			{session ? (
				<h1>Hello: {session.user?.name}</h1>
			) : (
				<h1>Not logged in</h1>
			)}
			<div className="home">
				<div>
					<h1>SPOTIFY</h1>
					<Link href="/api/auth/signin/spotify">
						<button type="button" className="spotify_auth_btn">
							Authenticate
						</button>
					</Link>
				</div>
				<div>
					<h1>YouTube</h1>
					<Link href="/api/auth/signin/google">
						<button type="button" className="youtube_auth_btn">
							Authenticate
						</button>
					</Link>
				</div>
				{session && playlistData ? (
					<ul>
						{playlistData.items.map((item: PlaylistItem) => {
							return (
								<li key={item.id}>
									<SpotifyPlaylistItem
										// name={item.name}
										// trackCount={item.track_total}
										item={item}
										// REMOVE THIS HANDLE ON CLICK SHIT

										playlistID={item.id}
									/>
								</li>
							);
						})}
					</ul>
				) : (
					<h1>Something went wrong!</h1>
				)}
			</div>
		</>
	);
}
