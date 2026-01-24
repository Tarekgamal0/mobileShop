import { List, ListItem, ListItemText, Paper, Typography, Box } from "@mui/material";
import { Star as StarIcon, AssignmentReturn as ReturnIcon, TrendingDown as DownIcon } from "@mui/icons-material";

export default function ProductRankingList({ title, data, color, iconType }) {
  // تحديد الأيقونة بناءً على النوع
  const Icon = iconType === "return" ? ReturnIcon : StarIcon;

  return (
    <Paper sx={{ p: 2, borderRadius: 3, height: "100%" }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        {/* تغيير اللون والأيقونة */}
        <Icon sx={{ color: color === "error.main" ? "#d32f2f" : "gold", fontSize: 18 }} />
        {title}
      </Typography>

      <List
        dense
        disablePadding
        sx={{
          maxHeight: 300, // ارتفاع يكفي لـ 5 عناصر تقريباً
          overflowY: "auto", // تفعيل السكرول العمودي
          pl: 1, // إزاحة بسيطة جهة اليمين لترك مساحة للسكرول بار
          direction: "rtl",
          /* تخصيص شكل السكرول بار ليكون أنيقاً */
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#bbb",
            },
          },
        }}
      >
        {data.map(([name, qty], index) => (
          <ListItem key={name} sx={{ px: 0, borderBottom: "1px solid #f9f9f9", direction: "ltr" }}>
            <ListItemText
              primary={`${index + 1}. ${name}`}
              secondary={`الكمية: ${qty}`}
              slotProps={{
                primary: {
                  variant: "body2",
                  fontWeight: "medium",
                },
              }}
            />
          </ListItem>
        ))}

        {data.length === 0 && (
          <Box sx={{ py: 2, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              لا توجد بيانات
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
}
