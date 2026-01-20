import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Login from "./routes/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./routes/Unauthorized";

import InventoryMangement from "./routes/owner/InventoryMangement";
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
import TransactionsMangement from "./routes/owner/TransactionsMangement";
import ReturnsHistory from "./routes/seller/ReturnsHistory";

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
          {/* 1. المسارات العامة (بدون Sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 2. مسارات مشتركة (البائع والمالك) - داخل Layout مع Sidebar */}
          <Route element={<ProtectedRoute allowedRoles={["seller", "owner"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/pos" element={<POS />} />
              <Route path="/repair" element={<ServiceRepair />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/returns" element={<ReturnsHistory />} />
            </Route>
          </Route>

          {/* 3. مسارات المالك فقط - داخل نفس الـ Layout */}
          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory-manage" element={<InventoryMangement />} />
              {/* <Route path="/transactions-manage" element={<TransactionsMangement />} /> */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/permissions" element={<UserPermissions />} />
            </Route>
          </Route>

          {/* 4. إعادة توجيه لأي مسار خطأ */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
