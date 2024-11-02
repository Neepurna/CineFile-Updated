import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { TMDBMovie, fetchMovies } from '../services/tmdb';

interface SearchBarProps {
  onMovieSelect: (movie: TMDBMovie) => void; // Function to handle movie selection
}

export default function SearchBar({ onMovieSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchMovies(1, query);
        setResults(data.results.slice(0, 5));
      } catch (error) {
        console.error('Failed to search movies:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleMovieClick = (movie: TMDBMovie) => {
    onMovieSelect(movie); // Pass the selected movie to the parent
    setQuery('');
    setResults([]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search movies..."
          className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {focused && (query || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {results.map((movie) => (
                <li key={movie.id}>
                  <button
                    onClick={() => handleMovieClick(movie)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 transition-colors text-left"
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-18 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-medium">{movie.title}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-gray-400">
              No movies found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
