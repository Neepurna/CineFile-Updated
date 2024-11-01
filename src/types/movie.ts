export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genre: string[];
  director: string;
  actors: string[];
  rating: number;
  watchStatus: 'watched' | 'watchLater' | 'notWatched';
}

export interface FilterState {
  search: string;
  genre: string;
  director: string;
  actor: string;
  rating: number | null;
}