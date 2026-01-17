import { useUsers } from "../contexts/UserContext";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export default function UserProfile({ userId }) {
  const { getUserById } = useUsers();

  // استدعاء الدالة لجلب المستخدم
  const user = getUserById(userId);

  if (!user) return <Typography>المستخدم غير موجود</Typography>;

  return (
    <Card sx={{ maxWidth: 345, m: "auto", mt: 5, textAlign: "right" }}>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: "primary.main" }}>{user.name[0]}</Avatar>
          <Typography variant="h6">{user.name}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>اسم المستخدم:</strong> {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>الصلاحية:</strong> {user.role === "owner" ? "مدير" : "بائع"}
        </Typography>
      </CardContent>
    </Card>
  );
}
