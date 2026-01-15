import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-5">
      <div className="bg-white p-10 rounded-lg shadow-md">
        {/* أيقونة تحذير */}
        <div className="text-red-500 text-6xl mb-4">⚠️</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">وصول غير مصرح به</h1>

        <p className="text-gray-600 mb-6">
          عذراً، أنت لا تملك الصلاحيات الكافية لعرض هذه الصفحة. يرجى التواصل مع المدير إذا كنت تعتقد أن هذا خطأ.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)} // العودة للصفحة السابقة
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            الرجوع للخلف
          </button>

          <button
            onClick={() => navigate("/")} // العودة للرئيسية
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
