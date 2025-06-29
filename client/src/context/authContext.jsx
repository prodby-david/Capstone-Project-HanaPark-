import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(localStorage.getItem('user')) || null
  });

  useEffect(() => {
    if (auth.user) {
      localStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [auth.user]);

  
  const logout = () => {
    setAuth({ user: null });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
