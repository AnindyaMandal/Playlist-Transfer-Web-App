import { handleError } from "@/lib/utils";
import { createClient } from "redis";

const client = createClient({
	username: "default",
	password: process.env.REDIS_DEFAULT_PASSWORD,
	socket: {
		host: process.env.REDIS_LOCAL_HOST,
		port: parseInt(process.env.REDIS_LOCAL_PORT!),
		connectTimeout: 5000,
	},
});

client.on("error", (err) => {
	console.log("Redis client error...", err);
});

export { client };
