# Cinefile - Source Files Documentation

## src/ Directory Structure

### Components/
- `CardStack.tsx` - Mobile swipe interface for movie discovery. Handles card animations, gestures, and infinite movie loading.
- `MovieCard.tsx` - Individual movie card component with poster, details, and action buttons.
- `MovieGrid.tsx` - Desktop grid layout for displaying multiple movie cards with infinite scroll.
- `Navigation.tsx` - App navigation bar with responsive design for mobile/desktop.
- `SearchBar.tsx` - Search functionality with real-time results and debouncing.
- `ReviewModal.tsx` - Modal for submitting movie reviews with star rating.
- `MovieDetailsModal.tsx` - Detailed movie information modal.
- `MovieFilters.tsx` - Filter controls for movie grid view.
- `ProtectedRoute.tsx` - Route wrapper for authentication protection.
- `LoginForm.tsx` - Authentication form component.

### Pages/
- `HomePage.tsx` - Main landing page with movie discovery interface.
- `LoginPage.tsx` - User authentication page.
- `ProfilePage.tsx` - User profile management.
- `CollectionsPage.tsx` - Movie collections and lists management.
- `SocialPage.tsx` - Social features interface.
- `GamesPage.tsx` - Movie-related games interface.
- `Dashboard.tsx` - User dashboard overview.

### Context/
- `AuthContext.tsx` - Authentication state management with persistent login.

### Services/
- `tmdb.ts` - TMDB API integration for fetching movie data.

### Types/
- `auth.ts` - Authentication-related TypeScript interfaces.
- `movie.ts` - Movie-related TypeScript interfaces.

### Hooks/
- `useMediaQuery.ts` - Custom hook for responsive design breakpoints.

### Main Files
- `App.tsx` - Root component with routing setup.
- `main.tsx` - Application entry point.
- `index.css` - Global styles and Tailwind CSS imports.
- `vite-env.d.ts` - Vite environment type declarations.