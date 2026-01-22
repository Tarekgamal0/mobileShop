import React from "react";
import { Box, Typography, Grid, Paper, Divider, Stack, Button, Chip } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import { useTransactions } from "../../contexts/TransactionsContext";

export default function ShiftHistory() {
  const { getClosedShifts } = useTransactions();
  const closedShifts = getClosedShifts();

  return (
    <Box sx={{ p: 4, direction: "ltr" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <HistoryIcon color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          سجل الورديات المغلقة
        </Typography>
      </Stack>

      {closedShifts.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography color="text.secondary">لا توجد ورديات مغلقة حتى الآن.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {closedShifts.map((shift, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, borderTop: "5px solid", borderColor: "primary.main" }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {shift.date}
                  </Typography>
                  <Chip label={`${shift.transactionCount} عملية`} size="small" variant="outlined" />
                </Stack>

                <Divider sx={{ mb: 2 }} />

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
                  <Typography variant="body1">الصافي المحقق:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {(shift.totalSales - shift.totalReturns).toLocaleString()} ج.م
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  sx={{ mt: 2 }}
                  onClick={() => window.print()} // يمكن تخصيصها لطباعة تقرير محدد
                >
                  إعادة طباعة التقرير
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
