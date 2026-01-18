import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";

export default function AddProductDialog({ open, onClose, onSave }) {
  const [newProduct, setNewProduct] = useState({ name: "", brand: "", price: "", stock: "", minStock: 2 });

  const handleSave = () => {
    onSave(newProduct);
    setNewProduct({ name: "", brand: "", price: "", stock: "", minStock: 2 }); // تصفير بعد الحفظ
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" dir="rtl" disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold" }}>إضافة منتج جديد</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="اسم الموديل"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="الماركة"
            fullWidth
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="السعر"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <TextField
              label="الكمية"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
            <TextField
              label="الحد الأدنى للتنبيه"
              type="number"
              fullWidth
              value={newProduct.minStock}
              onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          حفظ المنتج
        </Button>
      </DialogActions>
    </Dialog>
  );
}
