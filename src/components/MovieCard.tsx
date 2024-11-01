import { useState } from 'react';
import { Star, Eye, Clock, MessageSquare, Info, X, Plus } from 'lucide-react';
import { TMDBMovie, getImageUrl, GENRES } from '../services/tmdb';
import ReviewModal from './ReviewModal';
import MovieDetailsModal from './MovieDetailsModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface MovieCardProps {
  movie: TMDBMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [watchStatus, setWatchStatus] = useState<'none' | 'watched' | 'later'>('none');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const movieGenres = movie.genre_ids
    .map(id => GENRES[id])
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');

  const handleWatchedClick = () => {
    setWatchStatus(current => current === 'watched' ? 'none' : 'watched');
  };

  const handleWatchLaterClick = () => {
    setWatchStatus(current => current === 'later' ? 'none' : 'later');
  };

  const handleDetailsClick = () => {
    if (isMobile) {
      setIsFlipped(true);
    } else {
      setShowDetails(true);
    }
  };

  return (
    <>
      <div className="relative preserve-3d md:transform-none group">
        <div
          className={`relative transition-transform duration-500 preserve-3d md:transform-none ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <div className="backface-hidden md:transform-none w-full h-full">
            <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-w-2 aspect-h-3">
                {movie.poster_path ? (
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="font-semibold text-white truncate">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                </div>
                {movieGenres && (
                  <p className="text-sm text-gray-300 mt-1">{movieGenres}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleWatchedClick}
                  className={`p-2 rounded-full transition-colors ${
                    watchStatus === 'watched'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-900/80 hover:bg-gray-800 text-white'
                  }`}
                  title="Watched"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleWatchLaterClick}
                  className={`p-2 rounded-full transition-colors ${
                    watchStatus === 'later'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-900/80 hover:bg-gray-800 text-white'
                  }`}
                  title="Watch Later"
                >
                  <Clock className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowReview(true)}
                  className="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full text-white transition-colors"
                  title="Review"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDetailsClick}
                  className="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full text-white transition-colors"
                  title="Details"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Back of card (mobile only) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-800 rounded-lg p-4 md:hidden">
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-300 flex-1 overflow-y-auto">
                {movie.overview}
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setShowReview(true)}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Write Review</span>
                </button>
                <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add to List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          movie={movie}
          onClose={() => setShowReview(false)}
          onSubmit={(review) => {
            console.log('Review submitted:', review);
            setShowReview(false);
          }}
        />
      )}

      {showDetails && (
        <MovieDetailsModal
          movie={movie}
          onClose={() => setShowDetails(false)}
          onReview={() => {
            setShowDetails(false);
            setShowReview(true);
          }}
        />
      )}
    </>
  );
}