'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  user: { uid: string; email: string; displayName: string } | null;
  loading: boolean;
  logout: () => void;
  login: (userData: { displayName: string; userId: string; email: string }) => void;
}

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  logout: () => {},
  login: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          uid: userData.userId,
          email: userData.email,
          displayName: userData.displayName
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: { displayName: string; userId: string; email: string }) => {
    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Update the user state
    setUser({
      uid: userData.userId,
      email: userData.email,
      displayName: userData.displayName
    });
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}
