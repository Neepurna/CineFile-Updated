import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import MovieGrid from '../components/MovieGrid';
import CardStack from '../components/CardStack';
import { TMDBMovie, fetchMovies } from '../services/tmdb';
import ReviewModal from '../components/ReviewModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [showReview, setShowReview] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(1);
      setMovies(data.results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleWatched = (movie: TMDBMovie) => {
    setMovies(current => current.filter(m => m.id !== movie.id));
    if (movies.length <= 3) {
      loadMovies();
    }
  };

  const handleNotWatched = (movie: TMDBMovie) => {
    setMovies(current => current.filter(m => m.id !== movie.id));
    if (movies.length <= 3) {
      loadMovies();
    }
  };

  const handleWatchLater = (movie: TMDBMovie) => {
    setMovies(current => current.filter(m => m.id !== movie.id));
    if (movies.length <= 3) {
      loadMovies();
    }
  };

  const handleReview = (movie: TMDBMovie) => {
    setSelectedMovie(movie);
    setShowReview(true);
    setMovies(current => current.filter(m => m.id !== movie.id));
    if (movies.length <= 3) {
      loadMovies();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-6 w-6" />
          <p>{error}</p>
        </div>
        <button
          onClick={loadMovies}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="relative pt-4 pb-20 lg:pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          {isMobile ? (
            movies.length > 0 ? (
              <CardStack
                movies={movies}
                onWatched={handleWatched}
                onNotWatched={handleNotWatched}
                onWatchLater={handleWatchLater}
                onReview={handleReview}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400">No more movies to show</p>
              </div>
            )
          ) : (
            <MovieGrid query="" />
          )}
        </div>
      </main>

      {showReview && selectedMovie && (
        <ReviewModal
          movie={selectedMovie}
          onClose={() => {
            setShowReview(false);
            setSelectedMovie(null);
          }}
          onSubmit={(review) => {
            console.log('Review submitted:', review);
            setShowReview(false);
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
}