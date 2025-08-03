"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

const AuthContext = createContext({ user: null, loading: true });
const auth = getAuth(app);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("AuthProvider: User state changed. User is LOGGED IN:", user.uid);
      } else {
        console.log("AuthProvider: User state changed. User is LOGGED OUT.");
      }
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up listener.");
      unsubscribe();
    };
  }, []);

  const value = { user, loading };
  console.log("AuthProvider: Rendering with value:", { user: value.user?.uid, loading: value.loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);