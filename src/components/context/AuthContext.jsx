import React, { createContext, useContext, useState } from "react";
import { googleLogout } from "@react-oauth/google";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userInfo) => {
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    googleLogout(); // Logs out from Google
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);