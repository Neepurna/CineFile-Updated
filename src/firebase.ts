// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB7xuLiFAWV9-zq9ervosYA49fkie4fScM',
  authDomain: 'tinder-for-movies-81a3a.firebaseapp.com',
  projectId: 'tinder-for-movies-81a3a',
  storageBucket: 'tinder-for-movies-81a3a.appspot.com', // Corrected storage bucket URL
  messagingSenderId: '164004039869',
  appId: '1:164004039869:web:2ec5cf86cb97a85abcfbd4',
  measurementId: 'G-0Z5TTE45TV'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const analytics = getAnalytics(app); // Initialize Analytics

// Export auth and db for use in other parts of your app
export { auth, db, analytics };
