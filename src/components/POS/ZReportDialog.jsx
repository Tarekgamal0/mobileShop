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
  const { transactions } = useTransactions(); // مصفوفة واحدة الآن تجمع النوعين

  // 1. تصفية البيانات لليوم الحالي فقط
  const todayDate = new Date().toLocaleDateString();
  const todayTransactions = transactions.filter((t) => new Date(t.date).toLocaleDateString() === todayDate);

  // 2. حساب الإحصائيات في دورة واحدة (Single Pass)
  const stats = todayTransactions.reduce(
    (acc, curr) => {
      const amount = curr.total || 0;
      const method = curr.paymentMethod;

      if (curr.type === "sale") {
        acc.salesTotal += amount;
        if (method === "cash") acc.cashSales += amount;
        if (method === "visa") acc.visaSales += amount;
        if (method === "transfer") acc.transferSales += amount;
      } else if (curr.type === "return") {
        acc.returnsTotal += amount;
        if (method === "cash") acc.cashReturns += amount;
        if (method === "visa") acc.visaReturns += amount;
        if (method === "transfer") acc.transferReturns += amount;
      }
      return acc;
    },
    {
      salesTotal: 0,
      cashSales: 0,
      visaSales: 0,
      transferSales: 0,
      returnsTotal: 0,
      cashReturns: 0,
      visaReturns: 0,
      transferReturns: 0,
    },
  );

  // 3. الحسابات النهائية (الصافي لكل وسيلة)
  const netStats = {
    cash: stats.cashSales - stats.cashReturns,
    visa: stats.visaSales - stats.visaReturns,
    transfer: stats.transferSales - stats.transferReturns,
    totalNet: stats.salesTotal - stats.returnsTotal,
  };

  const handleConfirmZReport = () => {
    // ترحيل البيانات...
    console.log("التقرير النهائي لليوم:", netStats);
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
            <Typography fontWeight="bold">+{stats.salesTotal.toLocaleString()} ج.م</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", color: "error.main", direction: "ltr" }}>
            <Typography>إجمالي المرتجعات:</Typography>
            <Typography fontWeight="bold">-{stats.returnsTotal.toLocaleString()} ج.م</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "grey.100",
              p: 1.5,
              borderRadius: 1,
              direction: "ltr",
            }}
          >
            <Typography fontWeight="bold">صافي دخل اليوم:</Typography>
            <Typography fontWeight="bold" color="primary.main">
              {netStats.totalNet.toLocaleString()} ج.م
            </Typography>
          </Box>

          <Divider>صافي المبالغ المستلمة (بالخزينة)</Divider>

          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "success.main" }}>
                <Typography variant="caption" color="success.main" fontWeight="bold" display="block">
                  كاش
                </Typography>
                <Typography fontWeight="bold">{netStats.cash.toLocaleString()}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "info.main" }}>
                <Typography variant="caption" color="info.main" fontWeight="bold" display="block">
                  فيزا
                </Typography>
                <Typography fontWeight="bold">{netStats.visa.toLocaleString()}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "warning.main" }}>
                <Typography variant="caption" color="warning.main" fontWeight="bold" display="block">
                  تحويل
                </Typography>
                <Typography fontWeight="bold">{netStats.transfer.toLocaleString()}</Typography>
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
