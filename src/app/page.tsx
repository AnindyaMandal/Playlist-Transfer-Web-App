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
			{/* <pre>{JSON.stringify(playlistData, null, 2)}</pre> */}

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
				<div id="instructions">
					<div>
						<h1>SPOTIFY TO YOUTUBE</h1>
						<h3>
							Easily import your Spotify Playlists to YouTube for
							FREE!
						</h3>
					</div>
					<div>
						<h1>How do I transfer playlists?</h1>
						<h4>
							This step by step tutorial will guide you to move
							your playlists to YouTube
						</h4>
					</div>
					<div>
						<h2>Step One: Authenticate with Spotify</h2>
						<h3>
							Click Authenticate to log in to your Spotify account
						</h3>
						<h3>Grant permissions to access your playlist data</h3>
					</div>
					<div>
						<h2>Step Two: Get playlists</h2>
						<h3>
							Click on Get User Playlists to retrieve a list of
							your playlists
						</h3>
					</div>
					<div>
						<h2>Step Three: Select a playlist for transfer</h2>
						<h3>
							You can see a list of songs that are in your
							selected playlist
						</h3>
					</div>
					<div>
						<h2>Step Four: Search playlist songs on YouTube</h2>
						<h3>
							Once you have selected a playlist, click on YouTube
							Current Playlist
						</h3>
						<h3>
							Once the search is complete, each song in the
							playlist will have a link that takes you to a
							matching YouTube video
						</h3>
						<h3>
							Double check songs that have special characters in
							the title or artist name
						</h3>
					</div>
					<div>
						<h2>Step Five: Download data</h2>
						<h3>
							Click Download Song data to download your playlist
							songs and YouTube links as a JSON file
						</h3>
					</div>
					<div>
						<h2>Step Six: Download Script</h2>
						<h3>
							Due to API limitations from Google, this service is
							unable to automatically Search and add more than 200
							songs a day
						</h3>
						<h3>
							In order to keep this service free, this python
							script will search the songs from the JSON file on
							your Web broswer and add them to a YouTube playlist
						</h3>
						<h3>
							You must be signed into Google from your default
							browser. Currently supports Chrome and Firefox.
						</h3>
						<h3>
							It will automatically open tabs to songs on YouTube
							and control your mouse to add them to a playlist.
						</h3>
						<h3>
							This means that you cannot use your computer while
							this task is running, otherwise it will fail before
							adding all songs.
						</h3>
						<h3>
							Run this program when you know the computer will not
							be used.
						</h3>
					</div>
				</div>
				{/* {session && playlistData ? (
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
				)} */}
			</div>
		</>
	);
}
