import { ArtistData } from "./ArtistData";
export interface TrackItem {
	trackID: string;
	trackName: string;
	trackArtists: ArtistData[];
	albumType: string;
	albumName: string;
	albumReleaseDate: string;
	albumArtists: ArtistData[];
	popularity: number;
	trackURI: string;
	ytURI: string;
}
