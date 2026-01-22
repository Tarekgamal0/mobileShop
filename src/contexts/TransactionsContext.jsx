import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  // const [returns, setReturns] = useState([]);

  // 1. جلب البيانات من LocalStorage عند تشغيل التطبيق أول مرة
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("app-transactions") || "[]");
    setTransactions(savedTransactions);

    // const savedReturns = JSON.parse(localStorage.getItem("app-returns") || "[]");
    // setReturns(savedReturns);
  }, []);

  // حفظ البيانات في LocalStorage تلقائياً عند تغيير state
  const saveToLocal = (data) => {
    localStorage.setItem("app-transactions", JSON.stringify(data));
  };

  // 2. وظيفة لإضافة عملية بيع جديدة
  const addTransaction = (saleData) => {
    try {
      // const existingTransactions = JSON.parse(localStorage.getItem("app-transactions") || "[]");

      // حساب رقم الفاتورة:
      // نأخذ أكبر رقم فاتورة موجود ونضيف عليه 1، وإذا لم يوجد نبدأ من 1000
      const maxInvoiceNum = transactions.reduce((max, t) => (t.invoiceNumber > max ? t.invoiceNumber : max), 1000);

      const finalSaleObject = {
        ...saleData,
        invoiceNumber: maxInvoiceNum + 1, // رقم الفاتورة
        type: "sale",
      };

      const updatedTransactions = [finalSaleObject, ...transactions];

      setTransactions(updatedTransactions);
      saveToLocal(updatedTransactions);

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
      // تعديل سجل المرتجعات
      const finalReturnObject = {
        ...returnData,
        type: "return",
      };

      // 2. التعديل الجوهري: تحديث الكميات المسترجعة في الفاتورة الأصلية
      const updatedTransactions = transactions.map((t) => {
        if (t.invoiceNumber === returnData.InvoiceNumber) {
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

      const finalData = [finalReturnObject, ...updatedTransactions];
      setTransactions(finalData);
      saveToLocal(finalData);

      // 3. تحديث المخزن
      returnData.items.forEach((item) => adjustStockFn(item.id, item.quantity));

      return true;
    } catch (error) {
      return false;
    }
  };

  // 3. وظيفة لحذف عملية (اختياري)
  // const deleteTransaction = (id) => {
  //   const updated = transactions.filter((t) => t.id !== id);
  //   setTransactions(updated);
  //   localStorage.setItem("app-transactions", JSON.stringify(updated));
  // };

  // داخل TransactionsProvider في ملف TransactionsContext.jsx

  // 5. جلب العملاء (خصم المرتجعات من إجمالي إنفاقهم)
  const getUniqueCustomers = () => {
    const customersMap = new Map();

    transactions.forEach((t) => {
      const phone = t.customer?.phone;
      if (phone && phone !== "غير مسجل") {
        const isReturn = t.type === "return";
        const amount = t.total || 0;

        if (!customersMap.has(phone)) {
          customersMap.set(phone, {
            name: t.customer.name,
            phone: t.customer.phone,
            lastPurchase: t.date,
            // إذا كانت أول عملية بيع نضعها في المبيعات، وإذا كانت مرتجع نضعها في المرتجعات
            totalSales: !isReturn ? amount : 0,
            totalReturns: isReturn ? amount : 0,
            transactionsCount: 1,
          });
        } else {
          const existing = customersMap.get(phone);

          // تحديث البيانات
          customersMap.set(phone, {
            ...existing,
            // إضافة المبلع للمبيعات إذا كان نوع العملية بيع
            totalSales: existing.totalSales + (!isReturn ? amount : 0),
            // إضافة المبلغ للمرتجعات إذا كان نوع العملية مرتجع
            totalReturns: existing.totalReturns + (isReturn ? amount : 0),
            transactionsCount: existing.transactionsCount + 1,
            // تحديث التاريخ ليكون تاريخ آخر حركة تمت
            lastPurchase: t.date,
          });
        }
      }
    });

    // تحويل الـ Map لمصفوفة وحساب الصافي (Net) لكل عميل
    return Array.from(customersMap.values()).map((customer) => ({
      ...customer,
      netSpent: customer.totalSales - customer.totalReturns,
    }));
  };
  // 6. جلب الأرباح حسب التاريخ (طرح المرتجعات)
  const getRevenueByDate = (targetDate) => {
    return transactions
      .filter((t) => t.date.split(",")[0] === targetDate)
      .reduce((sum, t) => {
        return t.type === "return" ? sum - t.total : sum + t.total;
      }, 0);
  };

  const getAllTimeRevenue = () => {
    const dailyRevenue = {};
    transactions.forEach((t) => {
      const date = t.date.split(",")[0];
      const amount = t.type === "return" ? -t.total : t.total;
      dailyRevenue[date] = (dailyRevenue[date] || 0) + amount;
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
        addReturn,
        // deleteTransaction,
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
