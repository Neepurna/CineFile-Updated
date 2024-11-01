import { Gamepad2 } from 'lucide-react';

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-16">
        <Gamepad2 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">CineGames</h1>
        <p className="text-gray-400">Test your movie knowledge with fun games</p>
      </div>
    </div>
  );
}