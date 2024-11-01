# Cinefile - Source Files Overview

## Components

- `CardStack.tsx` - Tinder-style swipeable movie cards for mobile with infinite loading and double-tap review feature
- `MovieCard.tsx` - Reusable movie card with poster, details, and action buttons
- `MovieGrid.tsx` - Grid layout for desktop view with responsive columns and infinite scroll
- `Navigation.tsx` - Main navigation bar with mobile bottom tabs and desktop top bar
- `SearchBar.tsx` - Movie search component with real-time results and debouncing
- `ReviewModal.tsx` - Star rating and review submission modal
- `MovieDetailsModal.tsx` - Expanded movie information display
- `MovieFilters.tsx` - Genre, rating, and other filter controls
- `ProtectedRoute.tsx` - Authentication route guard
- `LoginForm.tsx` - User authentication form

## Pages

- `HomePage.tsx` - Landing page with movie discovery interface
- `LoginPage.tsx` - User sign-in page
- `ProfilePage.tsx` - User settings and profile management
- `CollectionsPage.tsx` - Movie lists and collections manager
- `SocialPage.tsx` - Social networking features
- `GamesPage.tsx` - Movie-related games interface
- `Dashboard.tsx` - User dashboard with overview stats

## Core Files

- `AuthContext.tsx` - Authentication state management with local storage persistence
- `tmdb.ts` - TMDB API service with movie fetching and randomization
- `auth.ts` - Authentication type definitions
- `movie.ts` - Movie-related interfaces
- `useMediaQuery.ts` - Responsive design breakpoint hook
- `App.tsx` - Main app component with routing
- `main.tsx` - Application entry point
- `index.css` - Global styles and Tailwind configuration