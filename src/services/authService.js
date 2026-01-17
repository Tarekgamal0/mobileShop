import initialUsers from "../mocks/users.json";

export const mockLogin = (username, password) => {
  // 1. جلب البيانات من الـ LocalStorage مباشرة
  const savedUsers = localStorage.getItem("app_users");

  let usersList;

  if (savedUsers) {
    usersList = JSON.parse(savedUsers);
  } else {
    // 2. إذا كانت الذاكرة فارغة، نستخدم الـ JSON ونحفظه للمستقبل
    usersList = initialUsers;
    localStorage.setItem("app_users", JSON.stringify(initialUsers));
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 3. البحث في القائمة التي حصلنا عليها
      const user = usersList.find((u) => u.username === username && u.password === password);

      if (user) {
        // نرسل البيانات بدون كلمة المرور للأمان
        const { password: _, ...userData } = user;
        resolve(userData);
      } else {
        // تأكد من إرجاع رسالة خطأ واضحة
        reject(new Error("اسم المستخدم أو كلمة المرور غير صحيحة"));
      }
    }, 1000);
  });
};
