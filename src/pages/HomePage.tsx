import { useState, useEffect, useCallback } from 'react';
import { TMDBMovie, fetchRandomMovies, fetchMovieDetails } from '../services/tmdb';
import ReviewModal from '../components/ReviewModal';
import CardStack from '../components/CardStack';
import SearchBar from '../components/SearchBar';
import { Eye, Clock, MessageSquare, XCircle } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { addToWatchList } = useAuth();

  // Load initial random movies
  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRandomMovies();
      if (data.length > 0) {
        setMovies(data);
        setSelectedMovie(data[0]);
        fetchDetails(data[0].id); // Fetch additional details for the first movie
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch additional movie details
  const fetchDetails = async (movieId: number) => {
    try {
      const details = await fetchMovieDetails(movieId);
      setMovieDetails(details);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleMovieSelect = (movie: TMDBMovie) => {
    setSelectedMovie(movie);
    fetchDetails(movie.id);
  };

  const getNextMovie = () => {
    if (movies.length > 1) {
      setMovies((current) => current.slice(1));
      setSelectedMovie(movies[1]);
      fetchDetails(movies[1].id);
    } else {
      loadMovies();
    }
  };

  const handleWatched = () => {
    if (selectedMovie) {
      addToWatchList(selectedMovie);
      getNextMovie();
    }
  };

  const handleWatchLater = () => {
    getNextMovie();
  };

  const handleNotInterested = () => {
    getNextMovie();
  };

  const openReviewModal = () => {
    setShowReview(true);
  };

  const closeReviewModal = () => {
    setShowReview(false);
  };

  // Function to generate the backdrop image style
  const backdropStyle = selectedMovie?.backdrop_path
    ? {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`,
        filter: 'blur(10px) brightness(0.4)',
        zIndex: -1,
      }
    : {};

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
          <p>{error}</p>
        </div>
        <button onClick={loadMovies} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backdropStyle}
      ></div>

      <main className="flex max-w-6xl w-full h-full">
        {isDesktop && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <SearchBar onMovieSelect={handleMovieSelect} />
          </div>
        )}
        
        {isDesktop ? (
          <div className="flex w-full h-full">
            {/* Movie Card on the Left */}
            {selectedMovie && (
              <div className="w-1/2 flex flex-col items-center justify-center p-6">
                <div className="bg-gray-800/70 rounded-lg p-4 shadow-xl backdrop-blur-md">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-64 h-auto rounded-lg mb-4"
                  />
                  <div className="flex justify-between w-full px-4">
                    <button
                      onClick={handleWatched}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                      title="Watched"
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleWatchLater}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      title="Watch Later"
                    >
                      <Clock className="h-6 w-6" />
                    </button>
                    <button
                      onClick={openReviewModal}
                      className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                      title="Review"
                    >
                      <MessageSquare className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNotInterested}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Not Interested"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Movie Details on the Right */}
            {selectedMovie && movieDetails && (
              <div className="w-1/2 flex flex-col justify-center p-6">
                <div className="bg-gray-800/70 rounded-lg p-6 shadow-xl backdrop-blur-md text-white">
                  <h2 className="text-4xl font-bold mb-4">{selectedMovie.title}</h2>
                  <p className="text-gray-300 mb-6">{selectedMovie.overview}</p>
                  <p className="text-gray-400 mb-2">
                    <strong>Rating:</strong> {selectedMovie.vote_average}/10
                  </p>
                  <p className="text-gray-400 mb-2">
                    <strong>Release Date:</strong> {new Date(selectedMovie.release_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 mb-2">
                    <strong>Genres:</strong> {movieDetails.genres.map((genre) => genre.name).join(', ')}
                  </p>
                  <p className="text-gray-400 mb-2">
                    <strong>Runtime:</strong> {movieDetails.runtime} minutes
                  </p>
                  <p className="text-gray-400 mb-2">
                    <strong>Language:</strong> {selectedMovie.original_language.toUpperCase()}
                  </p>
                  <p className="text-gray-400 mb-2">
                    <strong>Director:</strong> {movieDetails.credits.crew.find((person) => person.job === 'Director')?.name}
                  </p>
                  <p className="text-gray-400">
                    <strong>Cast:</strong> {movieDetails.credits.cast.slice(0, 5).map((actor) => actor.name).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <CardStack
            movies={movies}
            onWatched={handleWatched}
            onNotWatched={handleNotInterested}
            onReview={(movie) => {
              setSelectedMovie(movie);
              openReviewModal();
            }}
          />
        )}
      </main>

      {showReview && selectedMovie && (
        <ReviewModal
          movie={selectedMovie}
          onClose={closeReviewModal}
          onSubmit={(review) => {
            console.log('Review submitted:', review);
            closeReviewModal();
          }}
        />
      )}
    </div>
  );
}
