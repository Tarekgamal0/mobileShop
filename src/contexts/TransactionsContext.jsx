import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [returns, setReturns] = useState([]);

  // 1. جلب البيانات من LocalStorage عند تشغيل التطبيق أول مرة
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("app-transactions") || "[]");
    setTransactions(savedTransactions);

    const savedReturns = JSON.parse(localStorage.getItem("app-returns") || "[]");
    setReturns(savedReturns);
  }, []);

  // 2. وظيفة لإضافة عملية بيع جديدة
  const addTransaction = (saleData) => {
    try {
      const existingTransactions = JSON.parse(localStorage.getItem("app-transactions") || "[]");

      // حساب رقم الفاتورة:
      // نأخذ أكبر رقم فاتورة موجود ونضيف عليه 1، وإذا لم يوجد نبدأ من 1000
      const maxInvoiceNum = existingTransactions.reduce(
        (max, t) => (t.invoiceNumber > max ? t.invoiceNumber : max),
        1000,
      );

      const finalSaleObject = {
        ...saleData,
        invoiceNumber: maxInvoiceNum + 1, // زيادة الرقم بمقدار 1
      };

      const updatedTransactions = [finalSaleObject, ...existingTransactions];

      setTransactions(updatedTransactions);
      localStorage.setItem("app-transactions", JSON.stringify(updatedTransactions));

      return true;
    } catch (error) {
      console.error("Error saving transaction:", error);
      return false;
    }
  };

  //  وظيفة لإضافة عملية مرتجع جديدة مع تحديث الكميات في الفاتورة الأصلية
  const addReturn = (returnData, adjustStockFn) => {
    try {
      // 1. إضافة المرتجع لسجل المرتجعات (كما فعلنا سابقاً)
      const newReturn = { ...returnData, id: Date.now(), returnDate: new Date().toLocaleString() };

      // تعديل سجل المرتجعات
      const updatedReturns = [newReturn, ...returns];
      setReturns(updatedReturns);
      localStorage.setItem("app-returns", JSON.stringify(updatedReturns));

      // 2. التعديل الجوهري: تحديث الكميات المسترجعة في الفاتورة الأصلية
      const updatedTransactions = transactions.map((t) => {
        if (t.invoiceNumber === returnData.originalInvoiceNumber) {
          return {
            ...t,
            items: t.items.map((item) => {
              // ابحث عن هذا الصنف في قائمة الأصناف التي يتم إرجاعها الآن
              const returnedItem = returnData.items.find((ri) => ri.id === item.id);
              if (returnedItem) {
                // أضف الكمية المسترجعة الجديدة إلى ما تم استرجاعه سابقاً
                const prevReturnedQuantity = item.returnedQuantity || 0;
                return { ...item, returnedQuantity: prevReturnedQuantity + returnedItem.quantity };
              }
              return item;
            }),
          };
        }
        return t;
      });
      setTransactions(updatedTransactions);
      localStorage.setItem("app-transactions", JSON.stringify(updatedTransactions));

      // 3. تحديث المخزن
      returnData.items.forEach((item) => adjustStockFn(item.id, item.quantity));

      return true;
    } catch (error) {
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
        returns,
        addReturn,
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
