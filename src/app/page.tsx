import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { SpotifyWebApi } from "./lib/spotifyWebApi";
import SpotifyPlaylistItem from "@/components/SpotifyPlaylistItem";

export default async function Home() {
	const session = await getServerSession(options);
	const profileData = await SpotifyWebApi.getUserProfile();
	const playlistData = await SpotifyWebApi.getUserPlaylists();

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
					<button type="button" className="youtube_auth_btn">
						Authenticate
					</button>
				</div>
				{session && playlistData ? (
					<ul>
						{playlistData.items.map((item: any) => {
							return (
								<li key={item.id}>
									<SpotifyPlaylistItem data={item} />
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
