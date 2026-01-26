import { List, ListItem, ListItemText, Paper, Typography, Box, Grid } from "@mui/material";
import { Star as StarIcon, AssignmentReturn as ReturnIcon, TrendingDown as DownIcon } from "@mui/icons-material";
import {
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import MiniStatCard from "./MiniStatCard";

export default function SaleLayout({ stats }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%", // ا
        p: 2, // نفس الحجم الكبير الذي طلبته سابقاً
        mb: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "blue",
        bgcolor: "#ffffff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <TrendingUpIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: "text.primary" }}>
          مؤشرات الدخل والمبيعات
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MiniStatCard title="دخل اليوم" value={stats.revenue.daily} icon={<TrendingUpIcon />} color="#2e7d32" />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MiniStatCard title="دخل الأسبوع" value={stats.revenue.weekly} icon={<ShoppingCartIcon />} color="#1976d2" />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MiniStatCard title="دخل الشهر" value={stats.revenue.monthly} icon={<AssessmentIcon />} color="#9c27b0" />
        </Grid>
      </Grid>
    </Paper>
  );
}
