import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isDemoMode } from '../firebase/config';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider - wraps the app and provides auth state globally
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login with email and password
  const login = (email, password) => {
    if (isDemoMode) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const fakeUser = { uid: 'demo-user-123', email };
          localStorage.setItem('demo_user', JSON.stringify(fakeUser));
          setCurrentUser(fakeUser);
          resolve(fakeUser);
        }, 1000);
      });
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = () => {
    if (isDemoMode) {
      return new Promise((resolve) => {
        localStorage.removeItem('demo_user');
        setCurrentUser(null);
        resolve();
      });
    }
    return signOut(auth);
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - custom hook to consume auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
