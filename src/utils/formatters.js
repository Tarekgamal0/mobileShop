// src/utils/formatters.js

/**
 * تنسيق التاريخ إلى يوم/شهر/سنة
 * @param {string | Date} dateString
 * @returns {string} 15/05/2026
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(1, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const time = d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formatDate(d)} | ${time}`; // النتيجة: 25/01/2026 | 03:45 م
};

export const getRawToday = () => {
  return new Date().toISOString().split("T")[0];
};
/**
 * تنسيق العملة (اختياري - مفيد جداً)
 */
export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString() + " ج.م";
};
