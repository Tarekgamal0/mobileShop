import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Login from "./routes/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./routes/Unauthorized";

import Reports from "./routes/owner/Reports";
import Settings from "./routes/owner/Settings";
import Staff from "./routes/owner/Staff";
import UserPermissions from "./routes/owner/UserPermissions";

import Customers from "./routes/seller/Customers";
import Inventory from "./routes/seller/Inventory";
import POS from "./routes/seller/POS";
import ServiceRepair from "./routes/seller/ServiceRepair";

import MainLayout from "./components/MainLayout";
import Dashboard from "./routes/owner/Dashboard";
import Transactions from "./routes/seller/Transactions";
import ReturnsHistory from "./routes/seller/ReturnsHistory";
import Profile from "./routes/seller/Profile";
import ShiftHistory from "./routes/owner/ShiftHistory";

const theme = createTheme({
  palette: {
    // primary: {
    //   main: red[900],
    // },
    // secondary: {
    //   main: green[500],
    // },
  },
  typography: {
    fontFamily: ["IBMRegular"],
  },
  direction: "rtl",
});
// const appStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#f1b03e2b",
//   color: "black",
//   height: "100vh",
// };
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          {/* 1. المسارات العامة */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

          {/* 2. المسارات المحمية داخل Layout */}
          <Route element={<MainLayout />}>
            {/* مسار البروفايل متاح للجميع (بدون صلاحية خاصة) */}
            <Route path="/profile" element={<Profile />} />

            {/* مسارات العمليات اليومية */}
            <Route element={<ProtectedRoute requiredPermission="pos_view" />}>
              <Route path="/pos" element={<POS />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="inventory_view" />}>
              <Route path="/inventory" element={<Inventory />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="customers_view" />}>
              <Route path="/customers" element={<Customers />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="transactions_view" />}>
              <Route path="/transactions" element={<Transactions />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="returns_view" />}>
              <Route path="/returns" element={<ReturnsHistory />} />
            </Route>

            {/* مسارات الإدارة (عادة للمالك فقط أو بائع متميز) */}
            <Route element={<ProtectedRoute requiredPermission="dashboard_view" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="reports_view" />}>
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="shift_history_view" />}>
              <Route path="/shift" element={<ShiftHistory />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="permissions_manage" />}>
              <Route path="/permissions" element={<UserPermissions />} />
            </Route>

            {/* مسارات إضافية */}
            <Route element={<ProtectedRoute requiredPermission="settings_view" />}>
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
