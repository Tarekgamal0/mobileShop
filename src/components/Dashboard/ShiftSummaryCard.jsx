import React from "react";
import { Paper, Box, Typography, Stack, Tooltip, IconButton, Divider, Grid } from "@mui/material";
import { Assessment as AssessmentIcon, Print as PrintIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import TransactionsList from "../transactionsList";

export default function ShiftSummaryCard({
  title = "الوردية المفتوحة",
  netTotal = 0,
  sales = 0,
  returns = 0,
  onPrint,
  transactions,
  netStats,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "primary.light",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* أيقونة الخلفية الجمالية */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          opacity: 0.05,
          transform: "rotate(-15deg)",
          pointerEvents: "none", // لضمان عدم إعاقة النقر
        }}
      >
        <AssessmentIcon sx={{ fontSize: 120 }} />
      </Box>

      <Stack spacing={2.5}>
        {/* الرأس: العنوان وزر الطباعة */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
          </Stack>

          {onPrint && (
            <Tooltip title="طباعة تقرير مراجعة">
              <IconButton
                onClick={onPrint}
                color="primary"
                sx={{ bgcolor: "primary.50", "&:hover": { bgcolor: "primary.100" } }}
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* المبلغ الرئيسي */}
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary.main">
            {netTotal.toLocaleString()}{" "}
            <Typography component="span" variant="h6">
              ج.م
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            صافي النقدية المتاحة الآن
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* تفاصيل المبيعات والمرتجعات */}
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              إجمالي المبيعات
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: "center" }}>
              +{sales.toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              إجمالي المرتجعات
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="error.main" sx={{ textAlign: "center" }}>
              -{returns.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
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

        <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
          <TransactionsList transactions={transactions} />
        </Box>
      </Stack>
    </Paper>
  );
}
