import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the context
interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  login: () => {},
  logout: () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Function to log in and set the token
  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // Function to log out and remove the token
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // Check and update the auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
