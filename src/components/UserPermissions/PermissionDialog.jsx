import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import ALL_PERMISSIONS from "../../ALL_PERMISSIONS";

// مصفوفة الصلاحيات (يفضل وضعها في ملف ثابت مستقل واستيرادها)

export default function PermissionDialog({ open, onClose, editingUser, tempPermissions, setTempPermissions, onSave }) {
  const handleToggle = (permId) => {
    if (tempPermissions.includes(permId)) {
      setTempPermissions(tempPermissions.filter((p) => p !== permId)); // إزالة الصلاحية
    } else {
      setTempPermissions([...tempPermissions, permId]); // إضافة الصلاحية
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" disableRestoreFocus>
      <DialogTitle sx={{ textAlign: "right", fontWeight: "bold" }}>صلاحيات الموظف: {editingUser?.name}</DialogTitle>

      <DialogContent dir="rtl">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
          {ALL_PERMISSIONS.map((perm) => (
            <FormControlLabel
              key={perm.id}
              control={<Checkbox checked={tempPermissions.includes(perm.id)} onChange={() => handleToggle(perm.id)} />}
              label={perm.label}
              sx={{ textAlign: "right" }}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button variant="contained" onClick={onSave}>
          حفظ الصلاحيات
        </Button>
      </DialogActions>
    </Dialog>
  );
}
