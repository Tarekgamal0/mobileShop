import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Alert } from "@mui/material";

export default function AddUserDialog({ open, handleClose, handleSubmit, newUser, setNewUser, error }) {
  return (
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
            label="الرتبة"
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
  );
}
