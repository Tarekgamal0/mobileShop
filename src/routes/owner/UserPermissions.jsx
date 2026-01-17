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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AddIcon from "@mui/icons-material/Add";
import { useUsers } from "../../contexts/UserContext";

export default function UserPermissions() {
  const { users, searchQuery, setSearchQuery, updateUserRole, deleteUser, addUser, allUsers } = useUsers();

  // حالات النافذة والنموذج
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", username: "", password: "", role: "seller" });

  const handleOpen = () => {
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({ name: "", username: "", password: "", role: "seller" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من تكرار اسم المستخدم (Validation)
    const exists = allUsers.find((u) => u.username.toLowerCase() === newUser.username.toLowerCase());
    if (exists) {
      setError("اسم المستخدم هذا مسجل مسبقاً، اختر اسماً آخر.");
      return;
    }

    addUser(newUser);
    handleClose();
  };

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      {/* الرأس والزر */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          إدارة الصلاحيات
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ ml: 1 }} />}
          onClick={handleOpen}
          sx={{ borderRadius: 2, px: 3 }}
        >
          إضافة موظف جديد
        </Button>
      </Box>

      {/* شريط البحث */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="ابحث باسم الموظف أو اسم المستخدم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {/* الجدول */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>الموظف</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>اسم المستخدم</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>الرتبة</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: user.role === "owner" ? "secondary.main" : "info.main" }}>
                      {user.role === "owner" ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    </Avatar>
                    <Typography variant="body1" fontWeight="500">
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{user.username}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={user.role === "owner" ? "مدير نظام" : "بائع"}
                    color={user.role === "owner" ? "secondary" : "info"}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    <Select
                      size="small"
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      sx={{ minWidth: 110, borderRadius: 2 }}
                    >
                      <MenuItem value="owner">مدير</MenuItem>
                      <MenuItem value="seller">بائع</MenuItem>
                    </Select>
                    <Tooltip title="حذف">
                      <IconButton color="error" onClick={() => window.confirm("هل أنت متأكد؟") && deleteUser(user.id)}>
                        <DeleteSweepIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* نافذة الإضافة (Dialog) */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" disableRestoreFocus>
        <DialogTitle sx={{ textAlign: "right", fontWeight: "bold" }}>بيانات الموظف الجديد</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dir="rtl">
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="الاسم الثلاثي"
              margin="normal"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="اسم المستخدم (Login)"
              margin="normal"
              required
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              margin="normal"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField
              select
              fullWidth
              label="الصلاحية"
              margin="normal"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="owner">مدير (Owner)</MenuItem>
              <MenuItem value="seller">بائع (Seller)</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button onClick={handleClose} color="inherit">
              إلغاء
            </Button>
            <Button type="submit" variant="contained">
              إضافة الحساب
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
