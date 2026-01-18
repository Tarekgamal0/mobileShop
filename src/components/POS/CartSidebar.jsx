import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import CashIcon from "@mui/icons-material/Payments";
import VisaIcon from "@mui/icons-material/CreditCard";

export default function CartSidebar({
  cart,
  onRemoveOne,
  onCancel,
  onCheckout,
  paymentMethod,
  setPaymentMethod,
  totalPrice,
  totalItems,
}) {
  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", position: "sticky", top: 20 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        الفاتورة الحالية
      </Typography>
      <Divider />

      <List sx={{ maxHeight: "350px", overflow: "auto" }}>
        {cart.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton size="small" color="error" onClick={() => onRemoveOne(item.id)}>
                <RemoveCircleIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item.name} secondary={`${item.quantity} × ${item.price.toLocaleString()} ج.م`} />
          </ListItem>
        ))}
      </List>

      {cart.length > 0 && (
        <>
          <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, mt: 1 }}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">إجمالي القطع:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totalItems}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">الإجمالي:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {totalPrice.toLocaleString()} ج.م
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 2, p: 1.5, border: "1px solid #eee", borderRadius: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <Typography variant="subtitle2" fontWeight="bold">
                طريقة الدفع:
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ justifyContent: "space-around", mt: 1 }}
              >
                {/* خيار الكاش */}
                <FormControlLabel
                  value="cash"
                  control={<Radio size="small" />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CashIcon sx={{ color: paymentMethod === "cash" ? "primary.main" : "action.active" }} />
                      <Typography variant="body2">كاش</Typography>
                    </Stack>
                  }
                />

                {/* خيار الفيزا */}
                <FormControlLabel
                  value="visa"
                  control={<Radio size="small" />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <VisaIcon sx={{ color: paymentMethod === "visa" ? "primary.main" : "action.active" }} />
                      <Typography variant="body2">فيزا</Typography>
                    </Stack>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </>
      )}

      <Stack spacing={1} sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth size="large" onClick={onCheckout} disabled={cart.length === 0}>
          تأكيد العملية
        </Button>
        <Button variant="outlined" fullWidth color="error" onClick={onCancel} disabled={cart.length === 0}>
          إلغاء الفاتورة
        </Button>
      </Stack>
    </Paper>
  );
}
