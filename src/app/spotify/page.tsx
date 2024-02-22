"use client";
import Link from "next/link";
import React, { use, useState } from "react";
import SpotifyDataFetcher from "@/components/SpotifyDataFetcher";
import { Button } from "@/components/ui/button";

function SpotifyPage() {
	const [getData, setGetData] = useState(false);
	const handleClick = () => {
		if (!getData) setGetData(true);
	};
	return (
		<div>
			<div>
				<h1>SPOTIFY</h1>
				<Link href="/api/auth/signin/spotify">
					<button type="button" className="spotify_auth_btn">
						Authenticate
					</button>
				</Link>
				<Button onClick={handleClick} type="button">
					Get User Playlists
				</Button>
			</div>
			<div>
				{/* <SpotifyDataFetcher getData={getData}></SpotifyDataFetcher> */}
			</div>
		</div>
	);
}

export default SpotifyPage;
