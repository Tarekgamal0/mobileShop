import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { Dashboard, Inventory, PointOfSale, Build, People, Assessment, Settings, Logout } from "@mui/icons-material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import BuildIcon from "@mui/icons-material/Build";

const drawerWidth = 240;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // مصفوفة الروابط مع تحديد الأدوار
  const menuItems = [
    // { text: "لوحة التحكم", icon: <Dashboard />, path: "/dashboard", roles: ["owner"] },
    { text: "نقطة البيع", icon: <PointOfSale />, path: "/pos", roles: ["owner", "seller"] },
    { text: "المخزن", icon: <Inventory />, path: "/inventory", roles: ["owner", "seller"] },
    { text: "إدارة المخزن", icon: <Inventory />, path: "/inventory-manage", roles: ["owner"] },
    { text: "الصيانة", icon: <Build />, path: "/repair", roles: ["owner", "seller"] },
    { text: "العملاء", icon: <People />, path: "/customers", roles: ["owner", "seller"] },
    { text: "الموظفين", icon: <People />, path: "/staff", roles: ["owner"] },
    { text: "التقارير", icon: <Assessment />, path: "/reports", roles: ["owner"] },
    { text: "الإعدادات", icon: <Settings />, path: "/settings", roles: ["owner"] },
    { text: "صلحيات المستخدمين", icon: <PersonAddAltIcon />, path: "/permissions", roles: ["owner"] },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "#1e293b", color: "white" },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" color="primary.light">
          القائم الرئيسية
        </Typography>
        <Typography variant="caption" color="gray">
          {user?.name} ({user?.role === "owner" ? "مدير" : "بائع"})
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: "gray" }} />

      <List>
        {menuItems.map(
          (item) =>
            // شرط العرض بناءً على الـ Role
            item.roles.includes(user?.role) && (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    "&.Mui-selected": { bgcolor: "#334155" },
                    "&:hover": { bgcolor: "#334155" },
                    flexDirection: "row-reverse",
                    gap: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ textAlign: "left" }} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>

      <Box sx={{ marginTop: "auto", pb: 2 }}>
        <Divider sx={{ bgcolor: "gray" }} />
        <ListItemButton onClick={logout} sx={{ color: "#fb7185", flexDirection: "row-reverse", gap: 1.5 }}>
          <ListItemIcon sx={{ color: "#fb7185" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="تسجيل الخروج" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
