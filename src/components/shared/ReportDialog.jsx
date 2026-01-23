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
  TextField,
  MenuItem,
} from "@mui/material";
import { useTransactions } from "../../contexts/TransactionsContext";
import TransactionsList from "../transactionsList";
import { useMemo, useRef, useState } from "react";

export default function ReportDialog({ open, onClose, handleConfirm, type }) {
  // <-------- Shared ----------->
  const { transactions } = useTransactions(); // مصفوفة واحدة الآن تجمع النوعين
  const printRef = useRef();

  // <-------- التواريخ والحالة -------->
  const todayDate = useMemo(() => new Date().toLocaleDateString(), []);

  const availableDates = useMemo(() => {
    const dates = transactions.map((t) => t.date.split(",")[0]);
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  }, [transactions]);

  const [selectedDate, setSelectedDate] = useState(
    availableDates.includes(todayDate) ? todayDate : availableDates[0] || "",
  );

  // <-------- الفلترة والحسابات -------->
  const { filteredTransactions, stats, netStats } = useMemo(() => {
    // 1. الفلترة
    const filtered = transactions.filter((t) =>
      type === "Z" ? t.status === "open" : t.date.split(",")[0] === selectedDate,
    );

    // 2. الحسابات في دورة واحدة
    const calculatedStats = filtered.reduce(
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
    const calculatedNetStats = {
      cash: calculatedStats.cashSales - calculatedStats.cashReturns,
      visa: calculatedStats.visaSales - calculatedStats.visaReturns,
      transfer: calculatedStats.transferSales - calculatedStats.transferReturns,
      totalNet: calculatedStats.salesTotal - calculatedStats.returnsTotal,
    };
    return {
      filteredTransactions: filtered,
      stats: calculatedStats,
      netStats: calculatedNetStats,
    };
  }, [transactions, selectedDate, type]);

  // <-------- الوظائف -------->
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // لإرجاع React لحالته
  };
  const finalHandleConfirm = () => {
    // ترحيل البيانات...
    handleConfirm?.();
    handlePrint();
    onClose();
  };
  const isZReport = type === "Z";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: "error.main", color: "white" }}>
        {type === "Z" ? "تقرير إغلاق الوردية (Z-Report)" : "تقرير مراجعة (X-Report)"}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box ref={printRef}>
          <Stack spacing={2}>
            {isZReport ? (
              <Typography variant="subtitle2" color="text.secondary" align="center">
                تاريخ التقرير: {todayDate}
              </Typography>
            ) : (
              <TextField
                select
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                size="medium" // حجم أكبر للوضوح
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: 2,
                      bgcolor: "white",
                      direction: "ltr",
                    },
                  },
                }}
              >
                {availableDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date === todayDate ? `اليوم - ${date}` : date}
                  </MenuItem>
                ))}
                {availableDates.length === 0 && <MenuItem disabled>لا توجد بيانات</MenuItem>}
              </TextField>
            )}

            <Divider>الملخص المالي</Divider>

            <Box sx={{ display: "flex", justifyContent: "space-between", direction: "ltr" }}>
              <Typography>إجمالي المبيعات:</Typography>
              <Typography fontWeight="bold">{stats.salesTotal.toLocaleString()} ج.م</Typography>
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
              <Grid size={{ xs: 4 }}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "success.main" }}>
                  <Typography variant="caption" color="success.main" fontWeight="bold" display="block">
                    كاش
                  </Typography>
                  <Typography fontWeight="bold">{netStats.cash.toLocaleString()}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "info.main" }}>
                  <Typography variant="caption" color="info.main" fontWeight="bold" display="block">
                    فيزا
                  </Typography>
                  <Typography fontWeight="bold">{netStats.visa.toLocaleString()}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center", borderColor: "warning.main" }}>
                  <Typography variant="caption" color="warning.main" fontWeight="bold" display="block">
                    تحويل
                  </Typography>
                  <Typography fontWeight="bold">{netStats.transfer.toLocaleString()}</Typography>
                </Paper>
              </Grid>
            </Grid>

            <TransactionsList transactions={filteredTransactions} />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={finalHandleConfirm} variant="contained" color="error" size="large" fullWidth>
          تأكيد الإغلاق والترحيل
          {type === "Z" ? "تأكيد الإغلاق والترحيل" : "طباعة التقرير"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
