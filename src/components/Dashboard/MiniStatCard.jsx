import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

export default function MiniStatCard({ title, value, icon, color }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: `${color}15`, color: color }}>{icon}</Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value.toLocaleString()} ج.م
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
