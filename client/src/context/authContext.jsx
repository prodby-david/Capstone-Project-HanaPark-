import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(sessionStorage.getItem('user')) || null
  });

  useEffect(() => {
    if (auth.user) {
      sessionStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [auth.user]);

  
  const logout = () => {
    setAuth({ user: null });
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
