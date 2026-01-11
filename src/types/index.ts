// src/types/index.ts

export interface ImageQuality {
  quality: string;
  link?: string;
  url?: string;
}

export interface DownloadUrl {
  quality: string;
  link?: string;
  url?: string;
}

export interface Album {
  id: string;
  name: string;
  url?: string;
}

export interface ArtistInfo {
  id: string;
  name: string;
  image?: ImageQuality[];
  role?: string;
  url?: string;
}

export interface PrimaryArtist {
  id: string;
  name: string;
}

export interface Song {
  id: string;
  name: string;
  type?: string;
  album: Album;
  year?: string;
  releaseDate?: string | null;
  duration: string | number;
  label?: string;
  primaryArtists: string;
  primaryArtistsId?: string;
  featuredArtists?: string;
  featuredArtistsId?: string;
  explicitContent?: number;
  playCount?: string;
  language?: string;
  hasLyrics?: string | boolean;
  url?: string;
  copyright?: string;
  image: ImageQuality[];
  downloadUrl: DownloadUrl[];
  artists?: {
    primary: PrimaryArtist[];
    featured?: PrimaryArtist[];
    all?: PrimaryArtist[];
  };
}

export interface Artist {
  id: string;
  name: string;
  image?: ImageQuality[];
  url?: string;
  bio?: string;
  type?: string;
}

export interface SearchResponse {
  status: string;
  data: {
    results: Song[];
    total: number;
    start: number;
  };
}

export interface SongDetailsResponse {
  success: boolean;
  data: Song[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isLoading: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}

export interface QueueState {
  queue: Song[];
  currentIndex: number;
  originalQueue: Song[]; // For shuffle mode
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Player: undefined;
  Queue: undefined;
  Search: undefined;
  Songs: undefined;
  Albums: undefined;
  Artists: undefined;
  Folders: undefined;
  Suggested: undefined;
  AlbumDetail: { albumId: string };
  ArtistDetail: { artistId: string };
};