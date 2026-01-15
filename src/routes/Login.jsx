import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mockLogin } from "../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // تحديد المكان الذي كان يحاول المستخدم الوصول إليه قبل تحويله لصفحة الدخول
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // استدعاء دالة الـ Mock التي تبحث في ملف الـ JSON
      const userData = await mockLogin(username, password);
      console.log("Login successful:", userData);
      // تحديث الـ Context
      login(userData);

      // التوجيه بناءً على الصلاحية أو للمكان الذي أراده المستخدم
      if (userData.role === "owner") {
        navigate("/inventory-manage");
      } else {
        navigate("/pos");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ ما أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label>اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ادخل اسم المستخدم (admin أو seller)"
            required
          />
        </div>

        <div className="input-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور (123)"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "جاري التحقق..." : "دخول"}
        </button>

        <div className="hint-box">
          <p>تلميح للتجربة:</p>
          <p>المالك: admin / 123</p>
          <p>البائع: seller / 123</p>
        </div>
      </form>

      {/* تنسيق CSS بسيط مدمج للتوضيح */}
      <style>{`
        .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; font-family: sans-serif; direction: rtl; }
        .login-form { background: white; padding: 2rem; border-radius: 8px; shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h2 { text-align: center; color: #333; margin-bottom: 1.5rem; }
        .input-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; color: #666; }
        input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 0.8rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
        button:disabled { background: #ccc; }
        .error-message { background: #fee2e2; color: #dc2626; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; text-align: center; }
        .hint-box { margin-top: 1.5rem; font-size: 0.8rem; color: #888; background: #f9f9f9; padding: 0.5rem; border: 1px dashed #ddd; }
      `}</style>
    </div>
  );
}
