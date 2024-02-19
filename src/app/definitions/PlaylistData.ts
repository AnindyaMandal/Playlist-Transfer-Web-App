import { PlaylistItem } from "./PlaylistItem";
export interface PlaylistData {
	next: string;
	total: number;
	items: Array<PlaylistItem>;
}
