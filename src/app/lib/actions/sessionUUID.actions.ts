"use server";
import { client } from "../database/redis";

export async function addSessionData(
	sessionUuid: string,
	spotifyToken: string,
	spotifyUserId: string
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
	// await client.set(sessionUuid, spotifyToken, {
	// 	EX: 3600,
	// });
	// console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);
	await client.hSet(sessionUuid, "spotifyUserId", spotifyUserId);
	await client.hSet(sessionUuid, "spotifyToken", spotifyToken);

	console.log(
		`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken} ID: ${spotifyUserId}`
	);

	await client.quit();
}

export async function getSessionToken(sessionUuid: string) {
	await client.connect();

	// const value = await client.get(sessionUuid);

	const token = await client.hGet(sessionUuid, "spotifyToken");
	// const userId = await client.hGet(sessionUuid, "spotifyUserId");

	console.log(`Got Redis value: Key: ${sessionUuid} Token: ${token}`);
	await client.quit();

	if (token == undefined) return null;

	return token;
}

export async function getSessionUserId(sessionUuid: string) {
	await client.connect();
	const userId = await client.hGet(sessionUuid, "spotifyUserId");

	await client.quit();

	return userId;
}
