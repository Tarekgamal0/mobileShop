import { useState, useMemo } from "react";
import { useTransactions } from "../../contexts/TransactionsContext";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AssignmentReturn as ReturnIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import ReportDialog from "../../components/shared/ReportDialog";
import MiniStatCard from "../../components/Dashboard/MiniStatCard";
import ProductRankingList from "../../components/Dashboard/ProductRankingList";
import InfoCard from "../../components/Dashboard/InfoCard";
import ShiftSummaryCard from "../../components/Dashboard/ShiftSummaryCard";

export default function Dashboard() {
  const { transactions, getDashboardStats } = useTransactions();
  const [openXReport, setOpenXReport] = useState(false);

  const stats = useMemo(() => getDashboardStats(), [getDashboardStats]);

  // حساب بيانات الوردية الحالية بالتفصيل (للكاش والفيزا والتحويل)
  const currentShiftData = useMemo(() => {
    const openTransactions = transactions.filter((t) => t.status === "open");

    const totals = openTransactions.reduce(
      (acc, curr) => {
        const amount = curr.total || 0;
        // حساب النوع (بيع أو مرتجع)
        if (curr.type === "sale") acc.sales += amount;
        else acc.returns += amount;

        // حساب وسيلة الدفع (صافي: بيع - مرتجع)
        const method = curr.paymentMethod; // تأكد أن المسمى مطابق لديك (cash, visa, transfer)
        const factor = curr.type === "sale" ? 1 : -1;

        if (acc.netStats[method] !== undefined) {
          acc.netStats[method] += amount * factor;
        }

        return acc;
      },
      { sales: 0, returns: 0, netStats: { cash: 0, visa: 0, transfer: 0 } },
    );

    return {
      list: openTransactions,
      ...totals,
      netTotal: totals.sales - totals.returns,
    };
  }, [transactions]);

  return (
    <Box sx={{ p: 3, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        لوحة التحكم
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* تمرير البيانات كاملة للمكون */}
          <ShiftSummaryCard
            title="الوردية الحالية"
            netTotal={currentShiftData.netTotal}
            sales={currentShiftData.sales}
            returns={currentShiftData.returns}
            netStats={currentShiftData.netStats}
            transactions={currentShiftData.list}
            onPrint={() => setOpenXReport(true)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MiniStatCard title="دخل اليوم" value={stats.revenue.daily} icon={<TrendingUpIcon />} color="#2e7d32" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MiniStatCard
                title="دخل الأسبوع"
                value={stats.revenue.weekly}
                icon={<ShoppingCartIcon />}
                color="#1976d2"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MiniStatCard title="دخل الشهر" value={stats.revenue.monthly} icon={<AssessmentIcon />} color="#9c27b0" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard
                title="إجمالي العملاء المسجلين"
                value={stats.totalCustomers.size}
                icon={<PeopleIcon />}
                iconColor="#ed6c02" // لون برتقالي
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard
                title="مرتجعات الشهر الحالي"
                value={`${stats.returns.monthly.toLocaleString()} ج.م`}
                icon={<ReturnIcon />}
                iconColor="#d32f2f" // لون أحمر
              />
            </Grid>
          </Grid>

          {/* ترتيب المنتجات */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductRankingList title="الأكثر مبيعاً" data={stats.topSales} color="success.main" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductRankingList title="الأكثر إرجاعاً" data={stats.topReturns} color="error.main" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ReportDialog open={openXReport} onClose={() => setOpenXReport(false)} type="X" />
    </Box>
  );
}
