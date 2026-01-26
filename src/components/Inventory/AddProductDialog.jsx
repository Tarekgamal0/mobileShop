import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from "@mui/material";

import { CATEGORIES } from "../../constants/categories";

export default function AddProductDialog({ open, onClose, onSave }) {
  const initialValues = {
    name: "",
    brand: "",
    category: "",
    price: "",
    discount: 0,
    priceWithDiscount: 0,
    stock: "",
    minStock: 2,
  };

  const [newProduct, setNewProduct] = useState(initialValues);

  // --- تحديث تلقائي للسعر بعد الخصم عند تغيير السعر أو النسبة ---
  useEffect(() => {
    const p = Number(newProduct.price) || 0;
    const d = Number(newProduct.discount) || 0;
    const result = p - (p * d) / 100;
    setNewProduct((prev) => ({ ...prev, priceWithDiscount: result }));
  }, [newProduct.price, newProduct.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // تصحيح: تحويل الأرقام فوراً وضمان عدم وجود قيم NaN
    const processedValue = e.target.type === "number" ? (value === "" ? "" : Number(value)) : value;
    setNewProduct((prev) => ({ ...prev, [name]: processedValue }));
  };
  const handleConfirm = () => {
    const finalData = {
      ...newProduct,
      price: Number(newProduct.price) || 0,
      discount: Number(newProduct.discount) || 0,
      priceWithDiscount: Number(newProduct.priceWithDiscount) || 0,
      stock: Number(newProduct.stock) || 0,
    };
    onSave(finalData);
    setNewProduct({ name: "", brand: "", price: "", discount: 0, priceWithDiscount: 0, stock: "", minStock: 2 }); // تصفير بعد الحفظ
  };

  const handleClose = () => {
    setNewProduct(initialValues);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" dir="rtl" disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold" }}>إضافة منتج جديد</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select // هذه الخاصية تحول الحقل إلى Select Box
            label="القسم"
            name="category"
            fullWidth
            value={newProduct.category || ""} // أو formData.category في حال التعديل
            onChange={handleChange}
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="اسم الموديل" name="name" fullWidth value={newProduct.name} onChange={handleChange} />
          <TextField label="الماركة" name="brand" fullWidth value={newProduct.brand} onChange={handleChange} />
          <Stack direction="row" spacing={2}>
            <TextField
              label="السعر الاساسي"
              name="price"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={handleChange}
            />
            <TextField
              label="الخصم (%)"
              name="discount"
              type="number"
              fullWidth
              value={newProduct.discount}
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 100,
                },
              }}
            />
            <TextField
              label="السعر النهائي (بعد الخصم)"
              name="priceWithDiscount"
              fullWidth
              disabled // اجعله للقراءة فقط لأنه يُحسب تلقائياً
              value={newProduct.priceWithDiscount.toLocaleString()}
              sx={{ bgcolor: "grey.50" }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="الكمية"
              name="stock"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={handleChange}
            />
            <TextField
              label="الحد الأدنى للتنبيه"
              name="minStock"
              type="number"
              fullWidth
              value={newProduct.minStock}
              onChange={handleChange}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          حفظ المنتج
        </Button>
      </DialogActions>
    </Dialog>
  );
}
