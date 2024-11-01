import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Users, FolderHeart, Gamepad2, UserCircle } from 'lucide-react';
import SearchBar from './SearchBar';
import { useMediaQuery } from '../hooks/useMediaQuery'; // Import your custom hook for media query

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
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // Use media query to determine screen size

  return (
    <>
      {/* Top Navigation Bar for Desktop */}
      {isDesktop && (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-blue-600">Cinefile</h1>

            {/* Search Bar (only for desktop) */}
            <div className="flex-1 max-w-lg mx-4">
              <SearchBar />
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              {navItems.map(({ id, label, icon: Icon, path }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={id}
                    onClick={() => navigate(path)}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Bottom Navigation Bar for Mobile */}
      {!isDesktop && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 shadow-sm">
          <div className="flex justify-around items-center py-2">
            {navItems.map(({ id, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center text-xs ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
