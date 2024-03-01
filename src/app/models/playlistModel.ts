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

// import Playlist from "@/app/models/playlistModel";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
// 	try {
// 		const body = await req.json();
// 		const playlistData = body.formData;
// 		await Playlist.create(playlistData);

// 		return NextResponse.json(
// 			{ message: "Playlist Data Created" },
// 			{ status: 201 }
// 		);
// 	} catch (error) {
// 		return NextResponse.json({ message: "Error", error }, { status: 500 });
// 	}
// }
