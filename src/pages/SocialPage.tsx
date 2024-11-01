import { Users } from 'lucide-react';

export default function SocialPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">CinePal Social</h1>
        <p className="text-gray-400">Connect with fellow movie enthusiasts</p>
      </div>
    </div>
  );
}