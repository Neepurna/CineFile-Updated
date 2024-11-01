import { useState, useEffect, useCallback } from 'react';
import { TMDBMovie, GENRES, fetchRandomMovies } from '../services/tmdb';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Loader2, AlertCircle, Star } from 'lucide-react';

interface CardStackProps {
  onWatched: (movie: TMDBMovie) => void;
  onNotWatched: (movie: TMDBMovie) => void;
  onReview: (movie: TMDBMovie, review: { rating: number; content: string }) => void;
}

const SWIPE_THRESHOLD = window.innerWidth * 0.25;
const ROTATION_FACTOR = 0.15;
const LIFT_FACTOR = 1.1;
const BUFFER_SIZE = 10;
const VISIBLE_CARDS = 3;
const LOAD_THRESHOLD = 5;
const EXIT_DURATION = 200;
const FLIP_DURATION = 400;
const DOUBLE_TAP_DELAY = 300;

export default function CardStack({ onWatched, onNotWatched, onReview }: CardStackProps) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [lastTap, setLastTap] = useState(0);
  const [removingCard, setRemovingCard] = useState(false);

  const [springs, api] = useSprings(VISIBLE_CARDS, i => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
    rotateY: 0,
    opacity: 1,
    zIndex: VISIBLE_CARDS - i,
    config: { tension: 500, friction: 30 },
  }));

  const loadMoreMovies = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const newMovies = await fetchRandomMovies();
      setMovies(current => {
        const uniqueMovies = [...current];
        newMovies.forEach(movie => {
          if (!uniqueMovies.find(m => m.id === movie.id)) {
            uniqueMovies.push(movie);
          }
        });
        return uniqueMovies;
      });
    } catch (err) {
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (movies.length < BUFFER_SIZE && !removingCard) {
      loadMoreMovies();
    }
  }, [movies.length, loadMoreMovies, removingCard]);

  const handleCardExit = (index: number, direction: 'left' | 'right') => {
    if (removingCard || flippedCard !== null) return;
    setRemovingCard(true);

    const distance = window.innerWidth;
    const multiplier = direction === 'left' ? -1.5 : 1.5;
    const rotation = (Math.random() - 0.5) * 60;

    api.start(i => {
      if (i === 0) {
        return {
          x: distance * multiplier,
          rotateZ: rotation,
          scale: 0.5,
          opacity: 0,
          config: { duration: EXIT_DURATION },
          onRest: () => {
            removeCard(index);
            setRemovingCard(false);
          },
        };
      }
      return {
        zIndex: VISIBLE_CARDS - i - 1,
      };
    });
  };

  const handleDoubleTap = (index: number) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;
    
    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      if (flippedCard === index) {
        handleReviewCancel(index);
      } else {
        setFlippedCard(index);
        setRating(0);
        setReview('');
        api.start(i => {
          if (i === 0) {
            return {
              rotateY: 180,
              config: { duration: FLIP_DURATION },
            };
          }
        });
      }
    }
    setLastTap(now);
  };

  const handleReviewSubmit = (index: number) => {
    if (rating === 0 || !review.trim()) return;
    
    onReview(movies[index], { rating, content: review });
    handleCardExit(index, 'right');
  };

  const handleReviewCancel = (index: number) => {
    api.start(i => {
      if (i === 0) {
        return {
          rotateY: 0,
          config: { duration: FLIP_DURATION },
          onRest: () => setFlippedCard(null),
        };
      }
    });
  };

  const removeCard = (index: number) => {
    setMovies(current => {
      const remaining = current.slice(1);
      if (remaining.length < LOAD_THRESHOLD) {
        loadMoreMovies();
      }
      return remaining;
    });

    api.start(i => ({
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
      rotateY: 0,
      opacity: 1,
      zIndex: VISIBLE_CARDS - i,
      immediate: true,
    }));
  };

  const bind = useDrag(({ args: [index], active, movement: [mx], velocity, tap }) => {
    if (removingCard) return;
    
    if (tap) {
      handleDoubleTap(index);
      return;
    }

    // Only allow swipe gestures when card is not flipped
    if (flippedCard !== null) return;

    const trigger = velocity > 0.2;
    const horizontalSwipe = Math.abs(mx) > SWIPE_THRESHOLD;

    if (!active && (horizontalSwipe || trigger)) {
      if (mx > 0) {
        handleCardExit(index, 'right');
        onWatched(movies[index]);
      } else {
        handleCardExit(index, 'left');
        onNotWatched(movies[index]);
      }
    } else {
      api.start(i => {
        if (i === 0) {
          const rotateY = flippedCard === index ? 180 : 0;
          return {
            x: active ? mx : 0,
            rotateZ: active ? mx * ROTATION_FACTOR : 0,
            scale: active ? LIFT_FACTOR : 1,
            rotateY,
            opacity: 1,
            config: { tension: 500, friction: 30 },
          };
        }
        return {};
      });
    }
  });

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              loadMoreMovies();
            }}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 touch-none overflow-hidden">
      <div className="absolute inset-4">
        <div className="relative w-full h-full flex items-center justify-center">
          {springs.map((props, i) => {
            const movie = movies[i];
            if (!movie) return null;

            const movieGenres = movie.genre_ids
              .map(id => GENRES[id])
              .filter(Boolean)
              .slice(0, 2)
              .join(', ');

            const isFlipped = flippedCard === i;

            return (
              <animated.div
                key={movie.id}
                style={{
                  transform: interpolate(
                    [props.x],
                    (x) => `translate3d(${x}px,0,0)`
                  ),
                  zIndex: props.zIndex,
                  opacity: props.opacity,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  maxWidth: '400px',
                  maxHeight: '600px',
                  touchAction: 'none',
                  perspective: '1000px',
                }}
                {...(i === 0 ? bind(i) : {})}
              >
                <animated.div
                  style={{
                    transform: interpolate(
                      [props.rotateZ, props.rotateY, props.scale],
                      (rz, ry, s) => `rotateZ(${rz}deg) rotateY(${ry}deg) scale(${s})`
                    ),
                  }}
                  className="w-full h-full preserve-3d"
                >
                  {/* Front of card */}
                  <div className={`absolute inset-0 rounded-xl shadow-xl overflow-hidden bg-gray-800 backface-hidden ${
                    isFlipped ? 'pointer-events-none' : ''
                  }`}>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-xl font-semibold text-white mb-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="text-yellow-400 flex items-center gap-1">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{movieGenres}</p>
                      <p className="text-xs text-gray-400">
                        Swipe right to mark as watched
                        <br />
                        Swipe left to skip
                        <br />
                        Double tap to review
                      </p>
                    </div>
                  </div>

                  {/* Back of card (Review) */}
                  {i === 0 && (
                    <div className={`absolute inset-0 rounded-xl shadow-xl overflow-hidden bg-gray-800 backface-hidden rotate-y-180 ${
                      isFlipped ? '' : 'pointer-events-none'
                    }`}>
                      <div className="h-full p-6 flex flex-col">
                        <h3 className="text-xl font-semibold text-white mb-4">Review {movie.title}</h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                onClick={() => setRating(value)}
                                className="p-1 transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    value <= rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6 flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full h-[200px] px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                            placeholder="Share your thoughts about the movie..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReviewCancel(i)}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReviewSubmit(i)}
                            disabled={!rating || !review.trim()}
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </animated.div>
              </animated.div>
            );
          })}
        </div>
      </div>

      {loading && movies.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800/90 rounded-full text-white flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading more movies...</span>
        </div>
      )}
    </div>
  );
}