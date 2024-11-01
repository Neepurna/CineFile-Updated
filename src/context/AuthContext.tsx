import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  watchList: TMDBMovie[];
  addToWatchList: (movie: TMDBMovie) => void;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [watchList, setWatchList] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and watch list from Firestore on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
        };
        setUser(userData);

        // Load watch list from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWatchList(docSnap.data().watchList || []);
        } else {
          // If no document exists, create one
          await setDoc(docRef, { watchList: [] });
          setWatchList([]);
        }
      } else {
        // User is signed out
        setUser(null);
        setWatchList([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setWatchList([]);
  };

  const addToWatchList = async (movie: TMDBMovie) => {
    if (!user) return;

    // Update watch list locally
    setWatchList((currentList) => {
      if (!currentList.some((m) => m.id === movie.id)) {
        return [...currentList, movie];
      }
      return currentList;
    });

    // Update watch list in Firestore
    const docRef = doc(db, 'users', user.id);
    await setDoc(docRef, { watchList }, { merge: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        login,
        logout,
        user,
        watchList,
        addToWatchList,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
