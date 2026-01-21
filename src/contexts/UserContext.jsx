import React, { createContext, useContext, useState, useEffect } from "react";
import initialUsers from "../mocks/users.json"; // تأكد من مسار ملف الـ JSON
import bcrypt from "bcryptjs";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // محاكاة جلب البيانات عند تشغيل التطبيق
  useEffect(() => {
    // في الواقع هنا ستستخدم fetch أو axios لجلب البيانات من الـ API
    //setUsers(initialUsers);

    const savedUsers = localStorage.getItem("app_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // إذا لم يوجد شيء في الذاكرة، نأخذ من ملف الـ JSON لأول مرة فقط
      setUsers(initialUsers);
      localStorage.setItem("app_users", JSON.stringify(initialUsers));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("app_users", JSON.stringify(users));
    }
  }, [users, loading]);

  // دالة البحث: تعيد قائمة الموظفين المفلترة بناءً على الاسم أو اسم المستخدم
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // دالة حذف مستخدم
  const deleteUser = (id) => {
    const updated = users.filter((user) => user.id !== id);
    setUsers(updated);
    // localStorage.setItem("app_users", JSON.stringify(updated));
  };

  // دالة إضافة مستخدم جديد
  const addUser = (userData) => {
    const userWithId = {
      ...userData,
      id: Date.now(),
      password: bcrypt.hashSync(userData.password, 10), // تشفير تلقائي عند الإضافة
      permissions: userData.role === "owner" ? [] : ["pos_view"], // صلاحية افتراضية للبائع
    };
    const updated = [...users, userWithId];
    setUsers(updated);
    // localStorage.setItem("app_users", JSON.stringify(updated));
  };

  // دالة تحديث صلاحية (Role)
  const updateUserRole = (id, newRole) => {
    const updated = users.map((u) => (u.id === id ? { ...u, role: newRole } : u));
    setUsers(updated);
    // localStorage.setItem("app_users", JSON.stringify(updated));
  };

  const updateUserPermissions = (userId, newPermissions) => {
    const updatedList = users.map((u) => (u.id === userId ? { ...u, permissions: newPermissions } : u));
    setUsers(updatedList);
    localStorage.setItem("app_users", JSON.stringify(updatedList));
  };

  return (
    <UserContext.Provider
      value={{
        users: filteredUsers, // نمرر القائمة المفلترة دائماً للـ UI
        allUsers: users, // القائمة الكاملة إذا احتجنا إحصائيات
        searchQuery,
        setSearchQuery,
        deleteUser,
        addUser,
        updateUserRole,
        updateUserPermissions,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook مخصص لسهولة الاستخدام
export const useUsers = () => {
  return useContext(UserContext);
};
