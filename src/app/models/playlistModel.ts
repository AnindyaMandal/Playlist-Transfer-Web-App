import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const playlistSchema = new Schema(
	{
		name: String,
		description: String,
		playlistID: String,
		trackHref: String,
		trackTotal: Number,
	},
	{
		timestamps: true,
	}
);

const Playlist =
	mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist;
