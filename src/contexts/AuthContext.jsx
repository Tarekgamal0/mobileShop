import { createContext, useContext, useEffect, useState } from "react";

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

  const updatePassword = (allUsers, currentPassword, newPassword) => {
    // const allUsers = JSON.parse(localStorage.getItem("app-users") || "[]");
    console.log(user);

    if (user.password !== currentPassword) {
      return { success: false, message: "كلمة المرور الحالية غير صحيحة" };
    }

    const updatedUsers = allUsers.map((u) => {
      if (u.username === user.username) return { ...u, password: newPassword };
      return u;
    });

    localStorage.setItem("app_users", JSON.stringify(updatedUsers));

    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem("current_user", JSON.stringify(updatedUser));

    return { success: true, message: "تم تحديث كلمة المرور بنجاح" };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updatePassword }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
