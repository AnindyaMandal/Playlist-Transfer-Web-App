"use server";
import { client } from "../database/redis";

export async function addSessionData(
	sessionUuid: string,
	spotifyToken: string | null = null,
	spotifyUserId: string | null = null,
	googleToken: string | null = null
) {
	console.log("Adding session data redis...");
	try {
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

		// Set data with sessionUUID as key and spotify token as data with a TTL of 3600Sec/ just less than 1hr
		// await client.set(sessionUuid, spotifyToken, {
		// 	EX: 3600,
		// });
		// console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);
		console.log("Adding session data, client ready!");
		if (spotifyUserId != null)
			await client.hSet(sessionUuid, "spotifyUserId", spotifyUserId);

		if (spotifyToken != null)
			await client.hSet(sessionUuid, "spotifyToken", spotifyToken);

		if (googleToken != null)
			await client.hSet(sessionUuid, "googleToken", googleToken);

		console.log(
			`Set sessionUUID: ${sessionUuid} SP_Token: ${spotifyToken} SP_ID: ${spotifyUserId} GOGL_Token: ${googleToken}`
		);

		await client.expire(sessionUuid, 3600, "NX"); // Expire key after 1hr if it has no expiry
		await client.quit();
		await client.disconnect();
	} catch (error) {
		console.log(error);
	}
}

export async function getSessionToken(sessionUuid: string) {
	await client.connect();

	// const value = await client.get(sessionUuid);

	const token = await client.hGet(sessionUuid, "spotifyToken");
	// const userId = await client.hGet(sessionUuid, "spotifyUserId");

	console.log(`Got Redis value: Key: ${sessionUuid} Token: ${token}`);
	await client.quit();
	// await client.disconnect();

	if (token == undefined) return null;

	return token;
}

export async function getSessionUserId(sessionUuid: string) {
	await client.connect();
	const userId = await client.hGet(sessionUuid, "spotifyUserId");

	await client.quit();

	return userId;
}
