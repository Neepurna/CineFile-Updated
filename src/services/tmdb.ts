// Vite uses import.meta.env for environment variables
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export const GENRES: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export async function fetchMovies(page = 1, query?: string): Promise<TMDBResponse> {
  try {
    const endpoint = query
      ? `${BASE_URL}/search/movie`
      : `${BASE_URL}/discover/movie`;

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: page.toString(),
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: 'false',
      ...(query && { query }),
    });

    const response = await fetch(`${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results) {
      throw new Error('Invalid response format from TMDB API');
    }

    return {
      results: data.results.filter(
        (movie: TMDBMovie) =>
          movie.poster_path && movie.release_date && movie.vote_average
      ),
      total_pages: data.total_pages,
      total_results: data.total_results,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export async function fetchRandomMovies(): Promise<TMDBMovie[]> {
  try {
    const randomPage = Math.floor(Math.random() * 20) + 1;
    const data = await fetchMovies(randomPage);

    const shuffled = [...data.results];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.filter((movie) => movie.poster_path);
  } catch (error) {
    console.error('Error fetching random movies:', error);
    throw error;
  }
}

// New function to fetch detailed movie information
export async function fetchMovieDetails(movieId: number): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export function getImageUrl(path: string, size: 'w500' | 'original' = 'w500'): string {
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
