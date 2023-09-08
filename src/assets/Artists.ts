export default interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href?: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height?: number;
    url: string;
    width?: number;
  }[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}
