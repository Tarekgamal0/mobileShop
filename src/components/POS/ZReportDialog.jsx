import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Grid,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import { useTransactions } from "../../contexts/TransactionsContext";

export default function ZReportDialog({ open, onClose }) {
  const { transactions, returns } = useTransactions();

  // 1. تصفية البيانات لليوم الحالي فقط
  const todayDate = new Date().toLocaleDateString();
  const todaySales = transactions.filter((t) => new Date(t.date).toLocaleDateString() === todayDate);
  const todayReturns = returns.filter((r) => new Date(r.date).toLocaleDateString() === todayDate);

  // 2. حساب إحصائيات المبيعات حسب وسيلة الدفع
  const salesSummary = todaySales.reduce(
    (acc, curr) => {
      acc.total += curr.total;
      if (curr.paymentMethod === "cash") acc.cash += curr.total;
      if (curr.paymentMethod === "visa") acc.visa += curr.total;
      if (curr.paymentMethod === "transfer") acc.transfer += curr.total;
      return acc;
    },
    { total: 0, cash: 0, visa: 0, transfer: 0 },
  );

  // 3. حساب إحصائيات المرتجعات حسب وسيلة الدفع
  const returnsSummary = todayReturns.reduce(
    (acc, curr) => {
      acc.total += curr.total;
      if (curr.paymentMethod === "cash") acc.cash += curr.total;
      if (curr.paymentMethod === "visa") acc.visa += curr.total;
      if (curr.paymentMethod === "transfer") acc.transfer += curr.total;
      return acc;
    },
    { total: 0, cash: 0, visa: 0, transfer: 0 },
  );

  // 4. الحسابات النهائية (الصافي لكل وسيلة)
  const netStats = {
    cash: salesSummary.cash - returnsSummary.cash,
    visa: salesSummary.visa - returnsSummary.visa,
    transfer: salesSummary.transfer - returnsSummary.transfer,
    totalNet: salesSummary.total - returnsSummary.total,
  };

  const handleConfirmZReport = () => {
    console.log(todaySales);
    // ترحيل البيانات...
    console.log("التقرير النهائي:", netStats);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: "error.main", color: "white" }}>
        تقرير إغلاق اليومية (Z-Report)
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary" align="center">
            تاريخ التقرير: {todayDate}
          </Typography>

          <Divider>الملخص المالي</Divider>

          <Box sx={{ display: "flex", justifyContent: "space-between", direction: "ltr" }}>
            <Typography>إجمالي المبيعات:</Typography>
            <Typography fontWeight="bold">{salesSummary.total.toLocaleString()} ج.م</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", color: "error.main", direction: "ltr" }}>
            <Typography>إجمالي المرتجعات:</Typography>
            <Typography fontWeight="bold">-{returnsSummary.total.toLocaleString()} ج.م</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "grey.100",
              p: 1,
              borderRadius: 1,
              direction: "ltr",
            }}
          >
            <Typography fontWeight="bold">صافي المبيعات (الخزينة):</Typography>
            <Typography fontWeight="bold" color="primary.main">
              {netStats.totalNet.toLocaleString()} ج.م
            </Typography>
          </Box>

          <Divider>صافي المبالغ المستلمة</Divider>

          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "success.main" }}>
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  صافي الكاش
                </Typography>
                <Typography fontWeight="bold">{netStats.cash.toLocaleString()} ج.م</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "info.main" }}>
                <Typography variant="caption" color="info.main" fontWeight="bold">
                  صافي الفيزا
                </Typography>
                <Typography fontWeight="bold">{netStats.visa.toLocaleString()} ج.م</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "warning.main" }}>
                <Typography variant="caption" color="warning.main" fontWeight="bold">
                  تحويلات
                </Typography>
                <Typography fontWeight="bold">{netStats.transfer.toLocaleString()} ج.م</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={handleConfirmZReport} variant="contained" color="error" size="large" fullWidth>
          تأكيد الإغلاق والترحيل
        </Button>
      </DialogActions>
    </Dialog>
  );
}
