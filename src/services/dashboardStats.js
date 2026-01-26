const isWithinDays = (date, days) => {
  const diff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
  return diff <= days;
};

const isThisMonth = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// 2. دالة معالجة المنتجات
const processProductStats = (transactions) => {
  const sales = {};
  const returns = {};

  transactions.forEach((t) => {
    const isSale = t.type === "sale";
    const targetMap = isSale ? sales : returns;

    t.items?.forEach((item) => {
      targetMap[item.name] = (targetMap[item.name] || 0) + (item.quantity || 1);
    });
  });

  const getTopTen = (map) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  return { topSales: getTopTen(sales), topReturns: getTopTen(returns) };
};

const getCustomerFirstAppearance = (transactions) => {
  const firstDates = {};
  transactions.forEach((t) => {
    const phone = t.customer?.phone;
    if (phone && phone !== "غير مسجل") {
      const tDate = new Date(t.date).getTime();
      if (!firstDates[phone] || tDate < firstDates[phone]) {
        firstDates[phone] = tDate;
      }
    }
  });
  return firstDates; // { "010...": timestamp, "012...": timestamp }
};

// 3. الدالة الرئيسية (تجمع الدوال الصغيرة)
export const getDashboardStats = (transactions = []) => {
  const now = new Date();
  const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0)).getTime();
  const startOfWeek = new Date(new Date(now).setDate(now.getDate() - 7)).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const customerFirstDates = getCustomerFirstAppearance(transactions);

  const stats = {
    revenue: { daily: 0, weekly: 0, monthly: 0 },
    returns: { daily: 0, weekly: 0, monthly: 0 }, // إحصائيات المرتجعات المالية
    newCustomers: { daily: 0, weekly: 0, monthly: 0 },
    totalCustomers: Object.keys(customerFirstDates).length,
    productSales: {},
    productReturns: {},
  };

  // 1. حساب العملاء الجدد
  Object.values(customerFirstDates).forEach((firstDate) => {
    if (firstDate >= startOfDay) stats.newCustomers.daily++;
    if (firstDate >= startOfWeek) stats.newCustomers.weekly++;
    if (firstDate >= startOfMonth) stats.newCustomers.monthly++;
  });

  // 2. معالجة المعاملات (مالية + منتجات)
  transactions.forEach((t) => {
    const tDate = new Date(t.date).getTime();
    const amount = Number(t.total) || 0;
    const isSale = t.type === "sale";

    // حساب المالية
    if (tDate >= startOfDay) {
      isSale ? (stats.revenue.daily += amount) : (stats.returns.daily += amount);
    }
    if (tDate >= startOfWeek) {
      isSale ? (stats.revenue.weekly += amount) : (stats.returns.weekly += amount);
    }
    if (tDate >= startOfMonth) {
      isSale ? (stats.revenue.monthly += amount) : (stats.returns.monthly += amount);
    }

    // تحليل المنتجات (الأكثر مبيعاً والأكثر إرجاعاً)
    t.items?.forEach((item) => {
      const targetMap = isSale ? stats.productSales : stats.productReturns;
      targetMap[item.name] = (targetMap[item.name] || 0) + (Number(item.quantity) || 1);
    });
  });

  // 3. ترتيب أفضل المنتجات
  const getTopTen = (map) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  return {
    ...stats,
    topSales: getTopTen(stats.productSales),
    topReturns: getTopTen(stats.productReturns),
  };
};
