import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Divider, Stack, Button, Chip, MenuItem } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import { useTransactions } from "../../contexts/TransactionsContext";
import ReportDialog from "../../components/shared/ReportDialog";
import SearchField from "../../components/shared/SearchField";

export default function ShiftHistory() {
  const { getClosedShifts } = useTransactions();
  const closedShifts = useMemo(() => getClosedShifts(), [getClosedShifts]);

  const [selectedShift, setSelectedShift] = useState(null);
  const [tempShiftData, setTempShiftData] = useState(null);

  //منطق البحث (تصفية الورديات بالتاريخ أو الوقت)
  const [searchTerm, setSearchTerm] = useState(""); // حالة نص البحث
  const filteredShifts = useMemo(() => {
    if (!searchTerm) return closedShifts;
    const term = searchTerm.toLowerCase();
    return closedShifts.filter((shift) => shift.date.includes(term));
  }, [closedShifts, searchTerm]);

  // <--- حالة إضافية للاحتفاظ بالبيانات أثناء حركة الإغلاق --->
  useEffect(() => {
    // إذا تم اختيار شيفت، نحدث البيانات المؤقتة فوراً
    if (selectedShift) {
      setTempShiftData(selectedShift);
    }
    // لا نقوم بتصفير tempShiftData هنا عند الإغلاق
    // بل نتركه يحمل آخر قيمة حتى يختفي الديلوج تماماً
  }, [selectedShift]);

  return (
    <Box sx={{ p: 4, direction: "ltr" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <HistoryIcon color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          سجل الورديات المغلقة
        </Typography>
      </Stack>
      <SearchField placeholder="ابحث بالتاريخ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {filteredShifts.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography color="text.secondary">لا توجد ورديات مغلقة حتى الآن.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredShifts.map((shift, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, borderTop: "5px solid", borderColor: "primary.main" }}>
                <MenuItem key={shift.shiftId} value={shift.shiftId}>
                  <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ width: "100%" }}>
                    <Typography variant="body2" fontWeight="bold">
                      وردية: {shift.time}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {shift.date} | ({shift.transactionCount} عملية)
                    </Typography>
                  </Stack>
                </MenuItem>

                <Divider sx={{ mb: 2 }} />

                {/* تفاصيل المبالغ */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي المبيعات:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    +{shift.totalSales.toLocaleString()} ج.م
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي المرتجعات:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    -{shift.totalReturns.toLocaleString()} ج.م
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: "primary.light",
                    p: 1,
                    borderRadius: 1,
                    mt: 2,
                    color: "white",
                  }}
                >
                  <Typography variant="body1">الصافي :</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {(shift.totalSales - shift.totalReturns).toLocaleString()} ج.م
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => setSelectedShift(shift)} // يمكن تخصيصها لطباعة تقرير محدد
                >
                  عرض التقرير التفصيلي
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <ReportDialog
        open={Boolean(selectedShift)}
        onClose={() => setSelectedShift(null)}
        type="HISTORY" // نوع لعرض السجل
        data={tempShiftData?.transactions} // نرسل عمليات هذا الشيفت فقط
        title={`تقرير وردية ( ${tempShiftData?.time || ""} ) - بتاريخ ( ${tempShiftData?.date || ""} )`}
      />
    </Box>
  );
}
