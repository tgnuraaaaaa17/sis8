import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, firebaseConfigured, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function requireFirebase() {
    if (!firebaseConfigured) {
      throw new Error('Firebase Authentication is not configured for this deployment.');
    }
  }

  function register(email, password) {
    requireFirebase();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    requireFirebase();
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    requireFirebase();
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    requireFirebase();
    return signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
