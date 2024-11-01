import { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { TMDBMovie, fetchMovies } from '../services/tmdb';
import MovieCard from './MovieCard';

interface MovieGridProps {
  query: string;
  filter?: 'watched' | 'watchLater';
}

export default function MovieGrid({ query, filter }: MovieGridProps) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = useCallback(async (pageNum: number, isNewQuery: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(pageNum, query);
      
      // Filter movies based on watch status if filter is provided
      let filteredMovies = data.results;
      if (filter) {
        const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
        const watchLaterMovies = JSON.parse(localStorage.getItem('watchLaterMovies') || '[]');
        
        filteredMovies = data.results.filter(movie => {
          if (filter === 'watched') {
            return watchedMovies.includes(movie.id);
          } else if (filter === 'watchLater') {
            return watchLaterMovies.includes(movie.id);
          }
          return true;
        });
      }

      setMovies(prev => isNewQuery ? filteredMovies : [...prev, ...filteredMovies]);
      setHasMore(data.total_pages > pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies(1, true);
  }, [query, filter, loadMovies]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-6 w-6" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => loadMovies(page, false)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => {
              setPage(p => p + 1);
              loadMovies(page + 1, false);
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}