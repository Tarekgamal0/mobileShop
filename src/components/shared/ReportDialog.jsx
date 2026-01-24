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
import PrintIcon from "@mui/icons-material/Print";

export default function ReportDialog({ open, onClose, handleConfirm, type, data, title }) {
  // <-------- Shared ----------->
  const { transactions } = useTransactions(); // مصفوفة واحدة الآن تجمع النوعين
  const printRef = useRef();
  const isZReport = type === "Z";
  const isXReport = type === "X";

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
    // 1. تحديد البيانات المصدر
    const filtered =
      data || transactions.filter((t) => (isZReport ? t.status === "open" : t.date.split(",")[0] === selectedDate));

    // 2. الحسابات في دورة واحدة
    const initialStats = {
      salesTotal: 0,
      returnsTotal: 0,
      methods: { cash: 0, visa: 0, transfer: 0 },
    };
    const calculatedStats = filtered.reduce((acc, curr) => {
      const amount = curr.total || 0;
      const method = curr.paymentMethod;
      const isSale = curr.type === "sale";

      if (isSale) {
        acc.salesTotal += amount;
        if (acc.methods.hasOwnProperty(method)) acc.methods[method] += amount;
      } else {
        acc.returnsTotal += amount;
        if (acc.methods.hasOwnProperty(method)) acc.methods[method] -= amount;
      }
      return acc;
    }, initialStats);

    return {
      filteredTransactions: filtered,
      stats: calculatedStats,
      netStats: {
        ...calculatedStats.methods,
        totalNet: calculatedStats.salesTotal - calculatedStats.returnsTotal,
      },
    };
  }, [transactions, selectedDate, type, data]);

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

  // إعدادات المظهر بناءً على النوع
  const config = {
    Z: { color: "error.main", label: "تقرير إغلاق الوردية (Z-Report)" },
    X: { color: "primary.main", label: "تقرير مراجعة (X-Report)" },
    HISTORY: { color: "success.main", label: title || "سجل الوردية" },
  };

  const currentConfig = config[type] || config.X;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: currentConfig.color, color: "white" }}>
        {currentConfig.label}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box ref={printRef}>
          <Stack spacing={2}>
            {isXReport ? (
              <TextField
                select
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ direction: "ltr" }}
              >
                {availableDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date === todayDate ? `اليوم - ${date}` : date}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography variant="subtitle2" color="text.secondary" align="center" fontWeight="bold">
                {isZReport ? `تاريخ التقرير: ${todayDate}` : title}
              </Typography>
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
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<PrintIcon />}
          color={isZReport ? "error" : "primary"}
          sx={{ direction: "ltr" }}
          onClick={finalHandleConfirm}
        >
          {isZReport ? "تأكيد الإغلاق والترحيل" : "طباعة التقرير"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
