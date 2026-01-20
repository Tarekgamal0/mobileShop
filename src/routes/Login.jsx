import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mockLogin } from "../services/authService";

// استيراد مكونات MUI
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // لإظهار/إخفاء كلمة المرور
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // استدعاء دالة الـ Mock التي تبحث في ملف الـ JSON
      const userData = await mockLogin(username, password);
      login(userData);

      // التوجيه بناءً على الصلاحية أو للمكان الذي أراده المستخدم
      if (userData.role === "owner") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ ما أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f2f5", // نفس لون الخلفية الأصلي
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          {/* أيقونة القفل في الأعلى */}
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            تسجيل الدخول
          </Typography>

          {/* عرض الخطأ إن وجد */}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="اسم المستخدم"
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin أو seller"
              autoFocus
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
              // إضافة زر إظهار وإخفاء كلمة المرور
              slotProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "دخول"}
            </Button>

            {/* صندوق التلميحات (Hint Box) */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "action.hover",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
                textAlign: "left",
                direction: "ltr",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                تلميح للتجربة:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • المالك: <strong>admin</strong> / 123
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • البائع: <strong>seller</strong> / 123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
