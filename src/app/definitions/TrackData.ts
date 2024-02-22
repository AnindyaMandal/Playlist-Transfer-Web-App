import { TrackItem } from "./TrackItem";
export interface TrackData {
	next: string | null;
	total: number;
	items: TrackItem[];
}
