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
import {
  Dashboard,
  Inventory,
  PointOfSale,
  Build,
  People,
  Assessment,
  Settings,
  Logout,
  Paid,
  Undo,
  AccountCircle,
  History,
} from "@mui/icons-material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const drawerWidth = 240;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // مصفوفة الروابط مع تحديد الأدوار
  // const menuItems = [
  // { text: "العمليات", icon: <Paid />, path: "/transactions-manage", roles: ["owner"] },
  // { text: "الصيانة", icon: <Build />, path: "/repair", roles: ["owner", "seller"] },
  // { text: "الموظفين", icon: <People />, path: "/staff", roles: ["owner"] },
  // { text: "الإعدادات", icon: <Settings />, path: "/settings", roles: ["owner"] },
  // ];
  // مصفوفة الروابط تعتمد الآن على الصلاحيات (permissions)
  const menuItems = [
    { text: "لوحة التحكم", icon: <Dashboard />, path: "/dashboard", permission: "dashboard_view" },
    { text: "نقطة البيع", icon: <PointOfSale />, path: "/pos", permission: "pos_view" },
    { text: "العمليات", icon: <Paid />, path: "/transactions", permission: "transactions_view" },
    { text: "المرتجع", icon: <Undo />, path: "/returns", permission: "returns_view" },
    { text: "المخزن", icon: <Inventory />, path: "/inventory", permission: "inventory_view" },
    { text: "الورديات المغلقة", icon: <History />, path: "/shift", permission: "shift_history_view" },
    { text: "سجل العملاء", icon: <People />, path: "/customers", permission: "customers_view" },
    { text: "التقارير", icon: <Assessment />, path: "/reports", permission: "reports_view" },
    { text: "صلاحيات المستخدمين", icon: <PersonAddAltIcon />, path: "/permissions", permission: "permissions_manage" },
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
        {menuItems.map((item) => {
          // شرط العرض: إذا كان المستخدم "owner" يرى كل شيء، أو إذا كانت الصلاحية موجودة في مصفوفة permissions الخاصة به
          const hasAccess = user?.role === "owner" || user?.permissions?.includes(item.permission);

          return (
            hasAccess && (
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
          );
        })}
      </List>

      <Box sx={{ marginTop: "auto", pb: 2 }}>
        <Divider sx={{ bgcolor: "gray" }} />
        {/* زر الملف الشخصي الجديد */}
        <ListItemButton
          onClick={() => navigate("/profile")}
          selected={location.pathname === "/profile"}
          sx={{
            color: "white",
            flexDirection: "row-reverse",
            gap: 1.5,
            "&.Mui-selected": { bgcolor: "#334155" },
            "&:hover": { bgcolor: "#334155" },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="الملف الشخصي" sx={{ textAlign: "left" }} />
        </ListItemButton>

        {/* زر تسجيل الخروج */}
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
