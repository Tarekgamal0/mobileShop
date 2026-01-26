import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export default function DeleteProductDialog({ open, onClose, onConfirm, productName }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 1 } }} disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "right" }}>تأكيد حذف المنتج</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "right" }}>
          هل أنت متأكد من حذف <b>{productName}</b>؟ سيتم إزالته من المخزن نهائياً.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          إلغاء
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          تأكيد الحذف
        </Button>
      </DialogActions>
    </Dialog>
  );
}
