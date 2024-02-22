import { promises as fs } from "fs";
import { PlaylistData } from "../definitions/PlaylistData";

// DISABLED API CALL FOR NOW

export default async function getSampleData(): Promise<
	PlaylistData | undefined
> {
	try {
		const file = await fs.readFile(
			process.cwd() + "/src/sample.json",
			"utf8"
		);
		const data = JSON.parse(file);

		console.log(data);
		const cleanData = {
			next: data.next,
			total: data.total,
			items: data.items.map((element: any) => {
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

		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log("Sample Read Error: " + error.message + error.name);
		}
	}
}
