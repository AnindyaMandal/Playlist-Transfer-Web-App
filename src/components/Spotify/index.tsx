"use client";
export default function Spotify({ handleAuth }: any) {
	return (
		<div>
			<h1>SPOTIFY</h1>
			<button
				type="button"
				className="spotify_auth_btn"
				onClick={handleAuth}
			>
				Authenticate
			</button>
		</div>
	);
}
