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

// TODO:
// Finds if song exists via spotify ID
// If not returns false
// Otherwise returns the ytURI for the song
// Should only be used to find YouTube URIs
// I think
export const mongoFindSongExists = async (song: TrackItem) => {
	try {
		console.log(
			"Finding song exists:\t" + song.trackName + "\t" + song.trackID
		);
		await connectToDatabase();

		const foundSong = await Song.findOne(
			{ spotifyID: `${song.trackID}` },
			"youtubeURI"
		).exec();
		// const foundSong = await Song.findOne(
		// 	{ spotifyID: `3RXn3kWkPjRKrN5wx2LCZx` },
		// 	"youtubeURI"
		// ).exec();

		if (foundSong !== null) {
			console.log(foundSong.youtubeURI);
			return foundSong.youtubeURI;
		} else {
			console.log("Song not in DB");
			return false;
		}
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
