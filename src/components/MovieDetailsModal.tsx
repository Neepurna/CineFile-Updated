import { X, MessageSquare, Plus, Star } from 'lucide-react';
import { TMDBMovie, getImageUrl } from '../services/tmdb';

interface MovieDetailsModalProps {
  movie: TMDBMovie;
  onClose: () => void;
  onReview: () => void;
}

export default function MovieDetailsModal({ movie, onClose, onReview }: MovieDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          <div className="w-full md:w-1/3">
            {movie.poster_path ? (
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[300px] bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg text-white">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <p className="text-gray-300 mb-8">{movie.overview}</p>

            <div className="flex gap-4">
              <button
                onClick={onReview}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Write Review</span>
              </button>
              <button className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}