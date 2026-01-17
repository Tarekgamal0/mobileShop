import { createContext, useContext, useEffect, useState } from "react";
import { useUsers } from "./UserContext";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // عند تحميل التطبيق، نتحقق هل المستخدم مسجل دخول سابقاً؟
  useEffect(() => {
    // const savedUser = localStorage.getItem("user");
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("current_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
