import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Grid, Avatar, Divider, Alert, Snackbar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useUsers } from "../../contexts/UserContext";

export default function Profile() {
  // تصحيح: الـ Context يعيد كائن {} وليس مصفوفة []
  const { user, updatePassword } = useAuth();
  const { allUsers } = useUsers();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "info", open: false });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // 1. تحقق من تطابق كلمة المرور الجديدة
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: "كلمات المرور الجديدة غير متطابقة!", type: "error", open: true });
      return;
    }

    // 2. استدعاء الدالة من الـ Context (التي سنقوم بتعريفها بالأسفل)
    const result = updatePassword(allUsers, passwordData.currentPassword, passwordData.newPassword);

    if (result.success) {
      setMessage({ text: result.message, type: "success", open: true });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setMessage({ text: result.message, type: "error", open: true });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        {" "}
        إعدادات الحساب{" "}
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
            <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2, bgcolor: "primary.main" }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h6">{user?.name || "مستخدم"}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="textSecondary">
                اسم المستخدم: {user?.username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                الصلاحية: {user?.role === "owner" ? "مدير نظام" : "بائع"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {" "}
              تغيير كلمة المرور{" "}
            </Typography>
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="كلمة المرور الحالية"
                type="password"
                margin="normal"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="كلمة المرور الجديدة"
                type="password"
                margin="normal"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="تأكيد كلمة المرور الجديدة"
                type="password"
                margin="normal"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
              <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }} fullWidth>
                تحديث كلمة المرور
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* تنبيه لنجاح أو فشل العملية */}
      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={() => setMessage({ ...message, open: false })}
        // 1. تحديد مكان الظهور (أعلى المنتصف ليكون واضحاً جداً)
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        // 2. رفع مستوى الطبقة لضمان ظهورها فوق كل شيء
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setMessage({ ...message, open: false })} // إضافة زر إغلاق داخل التنبيه
          severity={message.type}
          variant="filled" // تجعل اللون قوياً وواضحاً
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
