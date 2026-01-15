import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // مهم جداً: ننتظر حتى ينتهي التطبيق من التحقق من وجود مستخدم في الـ localStorage
  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    // توجيه لصفحة Login إذا لم يكن هناك مستخدم
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من الصلاحية
  const isAuthorized = allowedRoles.includes(user.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />; // توجيه لصفحة Unauthorized إذا لم يكن لديه الصلاحية
  // outlet لعرض المكونات المحمية إذا كان لديه الصلاحية
};

export default ProtectedRoute;
