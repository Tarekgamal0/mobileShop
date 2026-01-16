import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", direction: "ltr" }}>
      <CssBaseline />
      <Box sx={{ width: 260, flexShrink: 0, direction: "rtl" }}>
        <Sidebar />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Outlet /> {/* هنا تظهر الصفحات (الـ Child Routes) */}
      </Box>
    </Box>
  );
}
