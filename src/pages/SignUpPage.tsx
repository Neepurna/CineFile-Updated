import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../firebase';

export default function SignUpPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      alert('A verification email has been sent to your email address. Please verify your email to log in.');

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      setError('Failed to create an account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/browse');
    } catch (error) {
      setError('Google sign-up failed');
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 mx-auto p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-sm md:text-base text-gray-400">Sign up to start your movie journey</p>
      </div>

      <form onSubmit={handleSignUp} className="mt-6 md:mt-8 space-y-4 md:space-y-6 bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg border border-gray-700">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p className="text-xs md:text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3 md:space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm md:text-base"
              placeholder="Enter your name"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm md:text-base"
              placeholder="Enter your email"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm md:text-base"
              placeholder="Enter your password"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm md:text-base"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 md:py-3 px-4 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base font-medium"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {/* Google Sign-Up Button */}
      <div className="flex items-center justify-center mt-4 md:mt-6">
        <button
          onClick={handleGoogleSignUp}
          className="flex items-center gap-2 py-2 md:py-3 px-4 bg-white text-gray-800 font-medium rounded-lg transition-colors hover:bg-gray-200 text-sm md:text-base"
        >
          <FcGoogle className="h-4 w-4 md:h-5 md:w-5" />
          <span>Sign up with Google</span>
        </button>
      </div>

      {/* Link to Log In */}
      <div className="flex items-center justify-center mt-4">
        <p className="text-gray-400 text-sm md:text-base">Already have an account?</p>
        <button
          onClick={() => navigate('/login')}
          className="text-indigo-500 hover:underline ml-2 text-sm md:text-base"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
