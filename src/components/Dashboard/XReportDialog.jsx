import React, { useState, useMemo } from "react";
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
  Chip,
  MenuItem,
  TextField,
} from "@mui/material";
import { useTransactions } from "../../contexts/TransactionsContext";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TransactionsList from "../transactionsList";

export default function XReportDialog({ open, onClose }) {
  const { transactions } = useTransactions();

  // 1. استخراج قائمة التواريخ المتاحة من العمليات
  const availableDates = useMemo(() => {
    const dates = transactions.map((t) => t.date.split(",")[0]);
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a)); // من الأحدث للأقدم
  }, [transactions]);

  // 2. حالة التاريخ المختار (افتراضياً تاريخ اليوم إذا وجد)
  const todayDateStr = new Date().toLocaleDateString();
  const [selectedDate, setSelectedDate] = useState(
    availableDates.includes(todayDateStr) ? todayDateStr : availableDates[0] || "",
  );

  // 3. فلترة الحركات بناءً على التاريخ المختار
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.split(",")[0] === selectedDate);
  }, [selectedDate, transactions]);

  // 4. الحسابات المالية للتاريخ المختار
  const stats = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, curr) => {
        const amount = curr.total || 0;
        if (curr.type === "sale") {
          acc.salesTotal += amount;
          acc.methods[curr.paymentMethod] = (acc.methods[curr.paymentMethod] || 0) + amount;
        } else {
          acc.returnsTotal += amount;
          acc.methods[curr.paymentMethod] = (acc.methods[curr.paymentMethod] || 0) - amount;
        }
        return acc;
      },
      { salesTotal: 0, returnsTotal: 0, methods: { cash: 0, visa: 0, transfer: 0 } },
    );
  }, [filteredTransactions]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: "primary.main", color: "white" }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <AssessmentIcon />
          <Typography variant="h6" fontWeight="bold">
            تقارير المراجعة (X-Report)
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          {/* قائمة اختيار التاريخ */}
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
                {date === todayDateStr ? `اليوم - ${date}` : date}
              </MenuItem>
            ))}
            {availableDates.length === 0 && <MenuItem disabled>لا توجد بيانات</MenuItem>}
          </TextField>

          <Divider>
            <Chip label="الملخص المالي" size="small" />
          </Divider>

          <Paper sx={{ p: 2, bgcolor: "primary.light", color: "white", textAlign: "center" }}>
            <Typography variant="caption">صافي دخل هذا اليوم</Typography>
            <Typography variant="h5" fontWeight="bold">
              {(stats.salesTotal - stats.returnsTotal).toLocaleString()} ج.م
            </Typography>
          </Paper>

          <Grid container spacing={1} sx={{ textAlign: "center", direction: "ltr", justifyContent: "center" }}>
            <Grid size={{ xs: 4 }}>
              <Typography variant="caption" color="success.main" display="block">
                إجمالي المبيعات
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                +{stats.salesTotal.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="caption" color="error.main" display="block">
                إجمالي المرتجعات
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                -{stats.returnsTotal.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          <Divider>
            <Chip label="تفاصيل الدفع" size="small" />
          </Divider>

          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography variant="caption" display="block">
                  كاش
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.methods.cash.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography variant="caption" display="block">
                  فيزا
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.methods.visa.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: "center" }}>
                <Typography variant="caption" display="block">
                  تحويل
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.methods.transfer.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* عرض جدول العمليات للتاريخ المختار */}
          <TransactionsList transactions={filteredTransactions} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} fullWidth variant="contained">
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
