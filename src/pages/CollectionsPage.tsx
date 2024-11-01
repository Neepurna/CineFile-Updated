import { useState } from 'react';
import { FolderHeart, Film, Clock, ListPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth from AuthContext
import { TMDBMovie } from '../services/tmdb';

type ListType = 'watched' | 'watchLater' | 'custom';

interface CustomList {
  id: string;
  name: string;
  description: string;
  movies: number[];
}

export default function CollectionsPage() {
  const { watchList } = useAuth(); // Access the watchList from AuthContext
  const [activeTab, setActiveTab] = useState<ListType>('watched');
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [customLists, setCustomLists] = useState<CustomList[]>([]);

  const tabs = [
    { id: 'watched', label: 'Watched', icon: Film },
    { id: 'watchLater', label: 'Watch Later', icon: Clock },
    { id: 'custom', label: 'Custom Lists', icon: ListPlus },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <FolderHeart className="w-16 h-16 text-indigo-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Your CineFile Collections</h1>
        <p className="text-gray-400">Organize and manage your movie lists</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as ListType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'watched' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchList.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center">
              No movies in your Watched List yet.
            </p>
          ) : (
            watchList.map((movie: TMDBMovie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-white truncate">{movie.title}</h2>
                  <p className="text-xs text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'watchLater' && (
        <div className="space-y-8">
          {/* Placeholder for Watch Later List */}
          <p className="text-gray-400">Watch Later List feature coming soon.</p>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-8">
          {customLists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListPlus className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Custom Lists Yet</h3>
              <p className="text-gray-400 mb-4">Create your first custom movie list</p>
              <button
                onClick={() => setShowNewListModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create List
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-medium text-white mb-2">{list.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{list.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{list.movies.length} movies</span>
                    <button className="text-indigo-400 hover:text-indigo-300">View List</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewListModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 bg-gray-800 rounded-xl shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Create New List</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    placeholder="Enter list name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white resize-none"
                    rows={3}
                    placeholder="Enter list description"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewListModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
