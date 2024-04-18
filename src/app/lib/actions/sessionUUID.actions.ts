"use server";
import { client } from "../database/redis";

export async function addSessionData(
	sessionUuid: string,
	spotifyToken: string
) {
	console.log("Adding session data redis...");
	await client.connect();

	// if (client.isReady) {
	// 	console.log("Adding session data, client ready!");
	// 	// Set data with sessionUUID as key and spotify token as data with a TTL of 3600Sec/ just less than 1hr
	// 	await client.set(sessionUuid, spotifyToken, {
	// 		EX: 3600,
	// 	});
	// 	console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);
	// }

	// console.log("Adding session data failed, client not ready");
	console.log("Adding session data, client ready!");
	// Set data with sessionUUID as key and spotify token as data with a TTL of 3600Sec/ just less than 1hr
	await client.set(sessionUuid, spotifyToken, {
		EX: 3600,
	});
	console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);

	await client.quit();
}

export async function getSessionData(sessionUuid: string) {
	await client.connect();

	const value = await client.get(sessionUuid);

	console.log(`Got Redis value: Key: ${sessionUuid} Val: ${value}`);
	await client.quit();

	return value;
}
