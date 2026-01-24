import React from "react";
import { Paper, Box, Typography, Avatar } from "@mui/material";

export default function InfoCard({ title, value, icon, iconColor = "orange", subtitle }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 2 },
      }}
    >
      <Avatar
        sx={{
          bgcolor: `${iconColor}15`, // لون خلفية شفاف بنسبة 15%
          color: iconColor,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="primary" sx={{ fontWeight: "500" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
