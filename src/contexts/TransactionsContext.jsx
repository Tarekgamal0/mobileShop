import { createContext, useContext, useState, useEffect } from "react";
import initialTransactions from "../mocks/transactions.json";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // تأكد من تعريف loading

  // تحميل البيانات عند البداية
  useEffect(() => {
    // 1. جلب البيانات من LocalStorage
    const savedTransactions = localStorage.getItem("app-transactions");

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem("app-transactions", JSON.stringify(initialTransactions));
    }

    setLoading(false);
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
        id: Date.now(), // إضافة ID فريد لكل عملية
        date: new Date().toLocaleString(),
        type: "sale",
        status: "open", // حالة الفاتورة عشان xreport
        invoiceNumber: maxInvoiceNum + 1, // رقم الفاتورة
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
        id: Date.now(), // إضافة ID فريد لكل عملية
        date: new Date().toLocaleString(),
        type: "return",
        status: "open", // حالة الفاتورة عشان xreport
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

  // 6. إغلاق الوردية الحالية
  const closeShift = () => {
    // نقوم فقط بتحويل العمليات المفتوحة إلى مغلقة
    const updatedTransactions = transactions.map((t) => {
      if (t.status === "open") {
        return {
          ...t,
          status: "closed",
          closedAt: new Date().toLocaleString(), // توقيت التصفير الفعلي
        };
      }
      return t;
    });

    setTransactions(updatedTransactions);
    saveToLocal(updatedTransactions);
    return true;
  };

  const getClosedShifts = () => {
    const shiftsMap = new Map();

    transactions
      .filter((t) => t.status === "closed")
      .forEach((t) => {
        // نستخدم t.closedAt كمفتاح فريد (Timestamp) لأنه يمثل لحظة إغلاق الوردية بالدقيقة والثانية
        // إذا لم يتوفر، نستخدم t.date كبديل احتياطي
        const shiftKey = t.closedAt || t.date;

        // لو الشيفت مش في الماب و لسة جديد
        if (!shiftsMap.has(shiftKey)) {
          shiftsMap.set(shiftKey, {
            shiftId: shiftKey, // معرف فريد للوردية
            date: t.closedAt ? t.closedAt.split(",")[0] : t.date.split(",")[0], // تاريخ اليوم للعرض فقط
            time: t.closedAt ? t.closedAt.split(",")[1] : "", // وقت الإغلاق للفصل بين ورديات اليوم
            totalSales: 0,
            totalReturns: 0,
            transactionCount: 0,
            transactions: [],
          });
        }

        const shift = shiftsMap.get(shiftKey);
        shift.transactionCount += 1;
        shift.transactions.push(t);
        if (t.type === "sale") shift.totalSales += t.total || 0;
        else shift.totalReturns += t.total || 0;
      });

    return Array.from(shiftsMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // جلب الأرباح للوردية المفتوحة حالياً فقط (للفترة الحالية قبل التصفير)
  const getOpenShiftRevenue = () => {
    return transactions
      .filter((t) => t.status === "open")
      .reduce((sum, t) => {
        return t.type === "return" ? sum - t.total : sum + t.total;
      }, 0);
  };

  // جلب الأرباح حسب التاريخ (شاملة المغلق والمفتوح لمراجعة اليوم كاملاً)
  const getRevenueByDate = (targetDate) => {
    return transactions
      .filter((t) => t.date.split(",")[0] === targetDate)
      .reduce((sum, t) => {
        return t.type === "return" ? sum - t.total : sum + t.total;
      }, 0);
  };

  //تعديل دالة getAllTimeRevenue لتكون شاملة
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

  const getDashboardStats = () => {
    const now = new Date();

    // تواريخ مرجعية
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let stats = {
      revenue: { daily: 0, weekly: 0, monthly: 0 },
      returns: { daily: 0, weekly: 0, monthly: 0 },
      productSales: {},
      productReturns: {},
      totalCustomers: new Set(),
      newWeeklyCustomers: new Set(),
    };

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      const isSale = t.type === "sale";
      const amount = t.total || 0;
      const phone = t.customer?.phone;

      // 1. حساب الأرباح (صافي المبيعات) والمرتجعات
      if (tDate >= startOfDay) {
        isSale ? (stats.revenue.daily += amount) : (stats.returns.daily += amount);
      }
      if (tDate >= startOfWeek) {
        isSale ? (stats.revenue.weekly += amount) : (stats.returns.weekly += amount);
        if (phone && phone !== "غير مسجل") stats.newWeeklyCustomers.add(phone);
      }
      if (tDate >= startOfMonth) {
        isSale ? (stats.revenue.monthly += amount) : (stats.returns.monthly += amount);
      }

      // 2. إحصائيات العملاء
      if (phone && phone !== "غير مسجل") stats.totalCustomers.add(phone);

      // 3. تحليل المنتجات
      t.items.forEach((item) => {
        const targetMap = isSale ? stats.productSales : stats.productReturns;
        targetMap[item.name] = (targetMap[item.name] || 0) + (item.quantity || 1);
      });
    });

    // ترتيب المنتجات (أفضل 5)
    const topSales = Object.entries(stats.productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topReturns = Object.entries(stats.productReturns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { ...stats, topSales, topReturns };
  };

  return (
    <TransactionsContext.Provider
      value={{
        loading,
        transactions,
        addTransaction,
        addReturn,
        getUniqueCustomers,
        closeShift,
        getClosedShifts,
        getOpenShiftRevenue,
        getRevenueByDate,
        getAllTimeRevenue,
        getDashboardStats,
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
