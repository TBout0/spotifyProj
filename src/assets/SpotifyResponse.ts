import SpotifyArtist from './Artists';
import SpotifyTrack from './Tracks';
export interface SpotifyResponse {
  items: SpotifyArtist[] | SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  href: string;
}
