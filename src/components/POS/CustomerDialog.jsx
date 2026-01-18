import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography } from "@mui/material";

export default function CustomerDialog({
  open,
  onClose,
  onConfirm,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      // لجعل الأنيميشن يبدو أفضل
      paper={{
        sx: { borderRadius: 3, p: 1 },
      }}
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pb: 0 }}>بيانات العميل</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            يمكنك ترك الحقول فارغة للمواصلة كـ "عميل نقدي"
          </Typography>

          <TextField
            label="اسم العميل"
            fullWidth
            autoFocus
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            variant="outlined"
          />

          <TextField
            label="رقم التليفون"
            fullWidth
            type="tel" // لفتح لوحة مفاتيح الأرقام على الموبايل
            value={customerPhone}
            onChange={(e) => {
              const val = e.target.value;
              // 1. السماح بالأرقام فقط
              // 2. التأكد من أن الطول لا يتجاوز 11 حرف
              if (/^\d*$/.test(val) && val.length <= 11) {
                setCustomerPhone(val);
              }
            }}
            variant="outlined"
            helperText={`${customerPhone.length}/11`} // اختياري: لإظهار عداد للأرقام
            // error={customerPhone.length > 0 && customerPhone.length < 11} // اختياري: إظهار لون أحمر إذا كان الرقم ناقصاً
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: "bold" }}>
          إلغاء
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
        >
          إتمام البيع
        </Button>
      </DialogActions>
    </Dialog>
  );
}
