import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Users, FolderHeart, Gamepad2, UserCircle, Search, X } from 'lucide-react';
import SearchBar from './SearchBar';

const navItems = [
  { id: 'browse', label: 'CineBrowse', icon: Film, path: '/browse' },
  { id: 'social', label: 'CinePal', icon: Users, path: '/social' },
  { id: 'collections', label: 'CineFile', icon: FolderHeart, path: '/collections' },
  { id: 'games', label: 'CineGames', icon: Gamepad2, path: '/games' },
  { id: 'profile', label: 'Profile', icon: UserCircle, path: '/profile' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden lg:flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Cinefile
            </h1>
          </div>

          <div className="flex-1 flex justify-around lg:justify-center lg:gap-8">
            {navItems.map(({ id, label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className={`flex flex-col lg:flex-row items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-indigo-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-6 w-6 lg:h-5 lg:w-5" />
                  <span className="text-xs lg:text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-400 hover:text-gray-200"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}