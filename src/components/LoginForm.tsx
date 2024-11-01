import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, Google } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase auth instance

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to continue watching</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Sign Up Link */}
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
          <Google className="h-5 w-5" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
