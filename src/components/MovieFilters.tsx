import { Search, ChevronDown } from 'lucide-react';
import { FilterState } from '../types/movie';

interface MovieFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  options: {
    genres: string[];
    directors: string[];
    actors: string[];
  };
}

export default function MovieFilters({ filters, onFilterChange, options }: MovieFiltersProps) {
  return (
    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange({ genre: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {options.genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={filters.director}
            onChange={(e) => onFilterChange({ director: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Directors</option>
            {options.directors.map((director) => (
              <option key={director} value={director}>{director}</option>
            ))}
          </select>

          <select
            value={filters.actor}
            onChange={(e) => onFilterChange({ actor: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Actors</option>
            {options.actors.map((actor) => (
              <option key={actor} value={actor}>{actor}</option>
            ))}
          </select>

          <select
            value={filters.rating?.toString() || ''}
            onChange={(e) => onFilterChange({ rating: e.target.value ? Number(e.target.value) : null })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}