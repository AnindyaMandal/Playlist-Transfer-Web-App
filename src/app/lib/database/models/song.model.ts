import { Document, Schema, model, models } from "mongoose";

// https://youtu.be/zgGhzuBZOQg?t=3986

export interface ISong extends Document {
	_id: string;
	name: string;
	spotifyID: string;
	trackArtists: string[];
	albumName: string;
	albumType: string;
	albumArtists: string[];
	spotifyURI: string;
	youtubeURI: string;
	verified: boolean;
}

const SongSchema = new Schema({
	name: { type: String, required: true },
	spotifyID: { type: String, required: true, unique: true },
	trackArtists: { type: [String], required: true },

	albumName: { type: String, required: true },
	albumType: { type: String, required: true },
	albumArtists: { type: [String], required: true },

	spotifyURI: { type: String, required: true },
	youtubeURI: { type: String, required: true },

	verified: { type: Boolean, default: false },
});

const Song = models.Song || model("Song", SongSchema);

export default Song;
