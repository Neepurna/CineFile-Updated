import { UserCircle, Settings, Heart, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Favorites</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Watch Later</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-sm text-gray-400">Reviews</div>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}