import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";

export default function ReturnDialog({ open, onClose, onConfirm, transaction }) {
  if (!transaction) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ direction: 'rtl' }}
    >
      <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
        <UndoIcon color="error" />
        تأكيد استرجاع الفاتورة
      </DialogTitle>
      
      <Divider />

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          هل أنت متأكد من رغبتك في استرجاع هذه العملية؟ 
          <br />
          <strong>سيتم إعادة المنتجات التالية إلى المخزن:</strong>
        </Typography>

        <Box sx={{ bgcolor: "#fff5f5", p: 1, borderRadius: 1, mt: 2 }}>
          <List dense>
            {transaction.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemText 
                  primary={item.name} 
                  secondary={`الكمية المسترجعة: ${item.quantity} قطعة`} 
                  sx={{ textAlign: 'right' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: "bold" }}>
          * سيتم حذف هذه العملية نهائياً من سجل المبيعات.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          إلغاء
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          startIcon={<UndoIcon />}
        >
          تأكيد الاسترجاع وإعادة للمخزن
        </Button>
      </DialogActions>
    </Dialog>
  );
}