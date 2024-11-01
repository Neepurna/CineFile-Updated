import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase auth instance

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle email and password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/browse');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/browse');
    } catch (error) {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-12 p-8">
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-serif tracking-tight">
            Cinefile
          </h1>
          <p className="text-xl text-gray-400">Your Personal Movie Journey</p>
        </div>

        <form
          className="space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign-Up Link */}
        <div className="flex items-center justify-center mt-4">
          <p className="text-gray-400">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-500 hover:underline ml-2"
          >
            Sign Up
          </button>
        </div>

        {/* Google Sign-In Button */}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 py-3 px-4 bg-white text-gray-800 font-medium rounded-lg transition-colors hover:bg-gray-200"
          >
            <FcGoogle className="h-5 w-5" /> {/* Google icon */}
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
