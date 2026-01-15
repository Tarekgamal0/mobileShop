import users from "../mocks/users.json";

export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // البحث عن المستخدم الذي يطابق الاسم وكلمة المرور
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        // نرسل البيانات بدون كلمة المرور (كما يفعل الـ Backend الحقيقي للأمان)
        const { password, ...userData } = user; // استبعاد كلمة المرور
        resolve(userData);
      } else {
        reject({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }
    }, 800);
  });
};
