"use server";

import { AddSongItem } from "@/app/definitions/AddSongItem";
import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../database";
import Song from "../database/models/song.model";
import { TrackItem } from "@/app/definitions/TrackItem";
import { ArtistData } from "@/app/definitions/ArtistData";

export const mongoAddSongData = async (song: TrackItem) => {
	try {
		// Connect to DB and write some data
		// tries to connect to cached connection or make new connection
		const schemaSong = convertTrackToSchema(song);
		await connectToDatabase();
		const newSong = await Song.create(schemaSong);

		console.log("Added song to DB");
		console.log(JSON.parse(JSON.stringify(newSong)));
	} catch (error) {
		handleError(error);
	}
};

function convertTrackToSchema(song: TrackItem): AddSongItem {
	const newSong: AddSongItem = {
		name: song.trackName,
		spotifyID: song.trackID,
		trackArtists: song.trackArtists.map((artist: ArtistData) => {
			return artist.name;
		}),
		albumName: song.albumName,
		albumType: song.albumType,
		albumArtists: song.albumArtists.map((artist: ArtistData) => {
			return artist.name;
		}),
		spotifyURI: song.trackURI,
		youtubeURI: song.ytURI,
		verified: false,
	};

	return newSong;
}
