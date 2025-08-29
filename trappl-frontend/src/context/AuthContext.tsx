import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
   googleId?: string;
}

interface UserDataFromApi {
    token: string;
    name: string;
    email: string;
    _id: string;
     googleId?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean; // New loading state
  login: (userData: UserDataFromApi) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start in a loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedUser: User = jwtDecode(storedToken);
        setToken(storedToken);
        setUser(decodedUser);
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    // Finished checking for a token
    setIsLoading(false);
  }, []);

  const login = (userData: UserDataFromApi) => {
    localStorage.setItem('authToken', userData.token);
    setToken(userData.token);
    setUser({ id: userData._id, name: userData.name, email: userData.email });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
