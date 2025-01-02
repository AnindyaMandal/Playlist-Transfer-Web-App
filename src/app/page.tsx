import { AudioLines, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Waveform from "@/components/waveform";

export default function Home() {
	return (
		<main className="relative w-full h-screen bg-black">
			<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
				<div>
					<Waveform />
				</div>
				<iframe
					className="border-r-8"
					src="https://open.spotify.com/embed/track/6z7X1kFAhBl28VRfK4yRTn?utm_source=generator"
					width="100%"
					height="250"
					allowFullScreen
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				></iframe>
				<h1 className="text-4xl font-bold">Playlist Transfer</h1>
				<p className="text-lg mt-4">Move your playlists with ease!</p>

				<Button size={"xl"}>
					<AudioLines size={48} />
					Get Started <ChevronRight size={48} />
				</Button>
			</div>
		</main>
	);
}
