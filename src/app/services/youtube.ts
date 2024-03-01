import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";

const youtube = google.youtube("v3");
const path = require("path");

async function searchTrackYT(query: string) {
	const auth = await authenticate({
		keyfilePath: path.join(__dirname, "../../../keys.json"),
		scopes: ["https://www.googleapis.com/auth/youtube"],
	});
	google.options({ auth });

	const res = await youtube.search.list({
		part: ["snippet"],
		q: query,
	});
	console.log(res.data);
}
