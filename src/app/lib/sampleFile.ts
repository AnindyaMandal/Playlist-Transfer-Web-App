// import { promises as fs } from "fs";
import { PlaylistData } from "../definitions/PlaylistData";
import data from "../../sample.json";

// DISABLED API CALL FOR NOW

// export default async function getSampleData(): Promise<
// 	PlaylistData | undefined
// > {
// 	try {
// 		const file = await fs.readFile(
// 			process.cwd() + "/src/sample.json",
// 			"utf8"
// 		);
// 		const data = JSON.parse(file);

// 		console.log(data);
// 		const cleanData = {
// 			next: data.next,
// 			total: data.total,
// 			items: data.items.map((element: any) => {
// 				const items = {
// 					name: element.name,
// 					description: element.description,
// 					id: element.id,
// 					track_href: element.tracks.href,
// 					track_total: element.tracks.total,
// 				};
// 				return items;
// 			}),
// 		};

// 		return cleanData;
// 	} catch (error: unknown) {
// 		if (error instanceof Error) {
// 			console.log("Sample Read Error: " + error.message + error.name);
// 		}
// 	}
// }

export default function getSampleData(): PlaylistData {
	const cleanData = {
		next: data.data.next,
		total: data.data.total,
		items: data.data.items.map((element: any) => {
			const items = {
				name: element.name,
				description: element.description,
				id: element.id,
				track_href: element.tracks.href,
				track_total: element.tracks.total,
			};
			return items;
		}),
	};
	console.log(cleanData);
	return cleanData;
}
