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
  Snackbar,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AddIcon from "@mui/icons-material/Add";
import { useUsers } from "../../contexts/UserContext";
import PermissionDialog from "../../components/UserPermissions/PermissionDialog";
import AddUserDialog from "../../components/UserPermissions/AddUserDialog";

export default function UserPermissions() {
  const { users, searchQuery, setSearchQuery, updateUserRole, deleteUser, addUser, allUsers, updateUserPermissions } =
    useUsers();

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

  const [editingUser, setEditingUser] = useState(null); // المستخدم الجاري تعديل صلاحياته
  const [tempPermissions, setTempPermissions] = useState([]); // الصلاحيات المؤقتة في النافذة
  const [permDialogOpen, setPermDialogOpen] = useState(false); // حالة فتح نافذة الصلاحيات

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleOpenPerms = (user) => {
    setEditingUser(user);
    setTempPermissions(user.permissions || []); // شحن الصلاحيات الحالية
    setPermDialogOpen(true);
  };

  const handleSavePerms = () => {
    if (editingUser?.id) {
      updateUserPermissions(editingUser.id, tempPermissions);
      setPermDialogOpen(false);
      setSnackbar({ open: true, message: `تم تحديث صلاحيات ${editingUser.name} بنجاح` });
    }
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
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>الصلاحيات</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>الحذف</TableCell>
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
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    sx={{ minWidth: 110, borderRadius: 2 }}
                  >
                    <MenuItem value="owner">مدير</MenuItem>
                    <MenuItem value="seller">بائع</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    {/* زر فتح الصلاحيات الجديد */}
                    <Tooltip title={user.role === "owner" ? "المدير لديه كافة الصلاحيات" : "تعديل صلاحيات الوصول"}>
                      <span>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AdminPanelSettingsIcon />}
                          onClick={() => handleOpenPerms(user)}
                          disabled={user.role === "owner"}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "0.75rem",
                            px: 2,
                          }}
                        >
                          الصلاحيات
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
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
      <AddUserDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        newUser={newUser}
        setNewUser={setNewUser}
        error={error}
      />
      <PermissionDialog
        open={permDialogOpen}
        onClose={() => setPermDialogOpen(false)}
        editingUser={editingUser}
        tempPermissions={tempPermissions}
        setTempPermissions={setTempPermissions}
        onSave={handleSavePerms}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        // اضبط الموقع هنا:
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      ;
    </Box>
  );
}
