import { Paper, Typography, Box, Grid } from "@mui/material";
import { People as PeopleIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import InfoCard from "./InfoCard"; // تأكد من المسار الصحيح

export default function CustomerLayout({ stats }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 2,
        mb: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "primary.light",
        bgcolor: "#ffffff",
      }}
    >
      {/* العنوان الرئيسي للقسم */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <PeopleIcon sx={{ color: "primary.main", fontSize: 32 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ color: "text.primary" }}>
          تحليل نمو العملاء الجدد
        </Typography>
      </Box>

      {/* توزيع الكروت بشكل عرضي متناسق */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="عملاء جدد (اليوم)"
            value={stats.newCustomers.daily}
            icon={<PersonAddIcon />}
            iconColor="#4caf50"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="عملاء جدد (الأسبوع)"
            value={stats.newCustomers.weekly}
            icon={<PeopleIcon />}
            iconColor="#0288d1"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="عملاء جدد (الشهر)"
            value={stats.newCustomers.monthly} // تم تصحيح المفتاح هنا من weekly إلى monthly
            icon={<PeopleIcon />}
            iconColor="#ed6c02"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard title="إجمالي العملاء" value={stats.totalCustomers} icon={<PeopleIcon />} iconColor="#ed0202" />
        </Grid>
      </Grid>
    </Paper>
  );
}
