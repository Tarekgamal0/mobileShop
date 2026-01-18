import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";

export default function EditProductDialog({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState(null);

  // تحديث البيانات الداخلية فور تغيير المنتج المختار
  useEffect(() => {
    if (product) setFormData({ ...product });
  }, [product]);

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" dir="rtl" disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold" }}>تعديل بيانات المنتج</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="اسم الموديل"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="الماركة"
            fullWidth
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="السعر"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <TextField
              label="الكمية"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
            <TextField
              label="الحد الأدنى للتنبيه"
              type="number"
              fullWidth
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={() => onSave(formData)} variant="contained" color="primary">
          تعديل المنتج
        </Button>
      </DialogActions>
    </Dialog>
  );
}
