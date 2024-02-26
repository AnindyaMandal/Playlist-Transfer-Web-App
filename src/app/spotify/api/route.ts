import Playlist from "@/app/models/playlistModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const playlistData = body.formData;
		await Playlist.create(playlistData);

		return NextResponse.json(
			{ message: "Playlist Data Created" },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json({ message: "Error", error }, { status: 500 });
	}
}
