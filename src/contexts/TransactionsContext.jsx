import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // 1. جلب البيانات من LocalStorage عند تشغيل التطبيق أول مرة
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("app-transactions") || "[]");
    setTransactions(savedTransactions);
  }, []);

  // 2. وظيفة لإضافة عملية بيع جديدة
  const addTransaction = (newSale) => {
    try {
      // تحديث الحالة (State)
      setTransactions((prev) => {
        const updated = [newSale, ...prev];
        // حفظ في LocalStorage
        localStorage.setItem("app-transactions", JSON.stringify(updated));
        return updated;
      });
      return true;
    } catch (error) {
      console.error("Error saving transaction:", error);
      return false;
    }
  };

  // 3. وظيفة لحذف عملية (اختياري)
  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("app-transactions", JSON.stringify(updated));
  };

  // داخل TransactionsProvider في ملف TransactionsContext.jsx

  const getUniqueCustomers = () => {
    const customersMap = new Map();

    transactions.forEach((t) => {
      const phone = t.customer.phone;
      // نتجنب إضافة "غير مسجل" كعميل فريد إذا أردت ذلك
      if (phone !== "غير مسجل") {
        if (!customersMap.has(phone)) {
          customersMap.set(phone, {
            name: t.customer.name,
            phone: t.customer.phone,
            lastPurchase: t.date,
            totalSpent: t.total,
            transactionsCount: 1,
          });
        } else {
          // تحديث بيانات العميل الموجود بالفعل
          const existing = customersMap.get(phone);
          customersMap.set(phone, {
            ...existing,
            totalSpent: existing.totalSpent + t.total,
            transactionsCount: existing.transactionsCount + 1,
          });
        }
      }
    });

    return Array.from(customersMap.values());
  };

  const getRevenueByDate = (targetDate) => {
    // targetDate متوقع أن يكون بصيغة "19/1/2026" مثلاً
    return transactions
      .filter((t) => t.date.split(",")[0] === targetDate) // نأخذ الجزء الخاص بالتاريخ فقط من السلسلة
      .reduce((sum, t) => sum + t.total, 0);
  };

  // دالة تجلب قائمة بكل الأيام وأرباحها (للرسم البياني مثلاً)
  const getAllTimeRevenue = () => {
    const dailyRevenue = {};

    transactions.forEach((t) => {
      const date = t.date.split(",")[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + t.total;
    });

    return Object.entries(dailyRevenue).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getUniqueCustomers,
        getRevenueByDate,
        getAllTimeRevenue,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return useContext(TransactionsContext);
};
