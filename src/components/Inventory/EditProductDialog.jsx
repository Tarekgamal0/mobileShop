import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";

export default function EditProductDialog({ open, onClose, onSave, product }) {
  const [formData, setFormData] = useState(null);

  // تحديث البيانات الداخلية فور تغيير المنتج المختار
  useEffect(() => {
    if (product) setFormData({ ...product });
  }, [product]);

  // 2. ميكانيكية الحساب التلقائي للسعر بعد الخصم
  useEffect(() => {
    if (formData) {
      const price = Number(formData.price) || 0;
      const discount = Number(formData.discount) || 0;
      const calculatedPrice = price - price * (discount / 100);

      // نحدث السعر النهائي فقط إذا كان مختلفاً عن الحالي لتجنب التكرار اللانهائي
      if (calculatedPrice !== formData.priceWithDiscount) {
        setFormData((prev) => ({ ...prev, priceWithDiscount: calculatedPrice }));
      }
    }
  }, [formData?.price, formData?.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // تصحيح: تحويل الأرقام فوراً وضمان عدم وجود قيم NaN
    const processedValue = e.target.type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleClose = () => {
    setFormData({ ...product });
    onClose();
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" dir="rtl" disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold" }}>تعديل بيانات المنتج</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="اسم الموديل" name="name" fullWidth value={formData.name} onChange={handleChange} />
          <TextField label="الماركة" name="brand" fullWidth value={formData.brand} onChange={handleChange} />
          <Stack direction="row" spacing={2}>
            <TextField
              label="السعر الاساسي"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
            />
            <TextField
              label="الخصم (%)"
              name="discount"
              type="number"
              fullWidth
              value={formData.discount}
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
              value={(formData.priceWithDiscount || 0).toLocaleString()}
              sx={{ bgcolor: "grey.50" }}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="الكمية"
              name="stock"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={handleChange}
            />
            <TextField
              label="الحد الأدنى للتنبيه"
              name="minStock"
              type="number"
              fullWidth
              value={formData.minStock}
              onChange={handleChange}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          إلغاء
        </Button>
        <Button
          onClick={() => onSave(formData)}
          variant="contained"
          color="primary"
          disabled={!formData.name || !formData.price}
        >
          تعديل المنتج
        </Button>
      </DialogActions>
    </Dialog>
  );
}
