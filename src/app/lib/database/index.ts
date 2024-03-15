import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
	if (cached.conn) {
		console.log("\n\tCACHED CONNECTION EXISTS!\n");
		return cached.conn;
	}

	if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");

	// const client = new MongoClient(MONGODB_URI, {
	// 	serverApi: {
	// 		version: ServerApiVersion.v1,
	// 		strict: true,
	// 		deprecationErrors: true,
	// 	},
	// });

	cached.promise =
		cached.promise ||
		mongoose.connect(MONGODB_URI, {
			dbName: "SpotifyDB",
			bufferCommands: false,
		});

	cached.conn = await cached.promise;
	console.log("\n\tNo existing Connection..\tConnecting to MongoDB...\n");
	return cached.conn;
};
