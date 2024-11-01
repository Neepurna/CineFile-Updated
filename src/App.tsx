import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SocialPage from './pages/SocialPage';
import CollectionsPage from './pages/CollectionsPage';
import GamesPage from './pages/GamesPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 pb-20 lg:pb-0 lg:pt-16">
                  <Navigation />
                  <HomePage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 pb-20 lg:pb-0 lg:pt-16">
                  <Navigation />
                  <SocialPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 pb-20 lg:pb-0 lg:pt-16">
                  <Navigation />
                  <CollectionsPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 pb-20 lg:pb-0 lg:pt-16">
                  <Navigation />
                  <GamesPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900 pb-20 lg:pb-0 lg:pt-16">
                  <Navigation />
                  <ProfilePage />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}