import { useState, useMemo } from "react";
import { useTransactions } from "../../contexts/TransactionsContext";
import { Box, Typography, Paper, IconButton, Stack, Divider, Tooltip } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PrintIcon from "@mui/icons-material/Print";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReportDialog from "../../components/shared/ReportDialog";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [openXReport, setOpenXReport] = useState(false);

  // حساب أرقام الوردية الحالية بسرعة لعرضها في البطاقة
  const currentShiftSummary = useMemo(() => {
    const openTransactions = transactions.filter((t) => t.status === "open");
    return openTransactions.reduce(
      (acc, curr) => {
        const amount = curr.total || 0;
        if (curr.type === "sale") acc.sales += amount;
        else acc.returns += amount;
        return acc;
      },
      { sales: 0, returns: 0 },
    );
  }, [transactions]);

  const netTotal = currentShiftSummary.sales - currentShiftSummary.returns;

  return (
    <Box sx={{ p: 2 }}>
      {/* بطاقة ملخص الوردية الحالية */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: 350,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* خلفية جمالية بسيطة */}
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            opacity: 0.05,
            transform: "rotate(-15deg)",
          }}
        >
          <AssessmentIcon sx={{ fontSize: 100 }} />
        </Box>

        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                الوردية الحالية (مفتوحة)
              </Typography>
            </Stack>
            <Tooltip title="طباعة تقرير مراجعة">
              <IconButton size="small" onClick={() => setOpenXReport(true)} color="primary">
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {netTotal.toLocaleString()}{" "}
              <Typography component="span" variant="caption">
                ج.م
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              صافي المبالغ في الخزينة الآن
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                المبيعات
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                +{currentShiftSummary.sales.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary" display="block">
                المرتجعات
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="error.main">
                -{currentShiftSummary.returns.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <ReportDialog open={openXReport} onClose={() => setOpenXReport(false)} type="X" />
    </Box>
  );
}
