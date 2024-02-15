// "use client";
// import Spotify from "@/components/Spotify";
// import Youtube from "@/components/Youtube";
// import { getSpotifyAuth } from "./spotifyAuth";
import Link from "next/link";
// import { useEffect, useState } from "react";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Home() {
	const session = await getServerSession(options);

	return (
		<>
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
			</div>
		</>
	);
}
