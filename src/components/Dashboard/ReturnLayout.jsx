import { Paper, Typography, Box, Grid } from "@mui/material";
import {
  AssignmentReturn as ReturnIcon,
  TrendingDown as DownIcon,
  EventNote as EventIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import MiniStatCard from "./MiniStatCard";
import { formatCurrency } from "../../utils/formatters";

export default function ReturnLayout({ stats }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 2, // نفس الحجم الكبير الذي طلبته سابقاً
        mb: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "error.light", // إطار خفيف باللون الأحمر للتفرقة
        bgcolor: "#ffffff",
      }}
    >
      {/* رأس القسم باللون الأحمر */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <DownIcon sx={{ color: "error.main", fontSize: 32 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ color: "text.primary" }}>
          مؤشرات الدخل والمبيعات
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ transform: "scale(1.05)" }}>
            <MiniStatCard
              title="مرتجع اليوم"
              value={stats.returns.daily}
              icon={<ReturnIcon />}
              color="#d32f2f" // أحمر غامق
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ transform: "scale(1.05)" }}>
            <MiniStatCard title="مرتجع الأسبوع" value={stats.returns.weekly} icon={<HistoryIcon />} color="#c62828" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ transform: "scale(1.05)" }}>
            <MiniStatCard title="مرتجع الشهر" value={stats.returns.monthly} icon={<EventIcon />} color="#b71c1c" />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
