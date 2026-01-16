import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

// استيراد البيانات من ملف الـ JSON
import initialUsers from "../../mocks/users.json";

export default function UserPermissions() {
  const [users, setUsers] = useState(initialUsers);

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsers(updatedUsers);
  };

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      {/* العنوان */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: "left", // محاذاة لليمين
          color: "primary.main",
        }}
      >
        إدارة صلاحيات المستخدمين
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="permissions table">
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              {/* محاذاة خلايا الرأس لليمين */}
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>اسم المستخدم</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>نوع الحساب</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>تعديل الرتبة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: user.role === "owner" ? "secondary.main" : "info.main" }}>
                      {user.role === "owner" ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    </Avatar>
                    <Typography variant="body1" fontWeight="500">
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={user.role === "owner" ? "مدير نظام" : "بائع"}
                    color={user.role === "owner" ? "secondary" : "info"}
                    size="large"
                  />
                </TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    sx={{
                      minWidth: 140,
                      "& .MuiSelect-select": { textAlign: "right" }, // محاذاة النص داخل الاختيار
                    }}
                  >
                    <MenuItem value="owner">مدير (Owner)</MenuItem>
                    <MenuItem value="seller">بائع (Seller)</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* صندوق تنبيه */}
      <Box
        sx={{
          mt: 4,
          p: 2,
          bgcolor: "#fff4e5",
          borderRadius: 2,
          borderRight: "6px solid #ffa117", // علامة برتقالية على اليمين
          textAlign: "left",
        }}
      >
        <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">
          تنبيه للمدير:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          تغيير الرتبة يؤثر فوراً على الصفحات التي يمكن للموظف الدخول إليها (مثل التقارير وإعدادات النظام).
        </Typography>
      </Box>
    </Box>
  );
}
