import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useTransactions } from "../../contexts/TransactionsContext";
import SearchField from "../../components/shared/SearchField";

export default function Customers() {
  const { getUniqueCustomers } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  // استخدام useMemo لتحسين الأداء عند البحث
  const customers = useMemo(() => getUniqueCustomers(), [getUniqueCustomers]);

  // فلترة العملاء بناءً على الاسم أو رقم التليفون
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm),
    );
  }, [customers, searchTerm]);

  return (
    <Box sx={{ p: 4, direction: "rtl" }}>
      {/* Header مع عرض إجمالي عدد العملاء */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          قائمة العملاء
        </Typography>
        <Chip
          label={`إجمالي العملاء: ${customers.length}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: "bold" }}
        />
      </Stack>

      {/* شريط البحث */}
      <Box sx={{ mb: 3 }}>
        <SearchField
          placeholder="ابحث باسم العميل أو رقم التليفون..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* جدول العملاء */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, direction: "ltr" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                العميل
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                رقم التليفون
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                عدد العمليات
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                إجمالي المشتريات (+)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                إجمالي المسترجع (-)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الصافي النهائي
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                تاريخ آخر عملية
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="left">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.light", width: 35, height: 35 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" fontWeight="bold">
                        {customer.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="left">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="inherit" color="action" />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      icon={<ShoppingBagIcon style={{ fontSize: "14px" }} />}
                      label={customer.transactionsCount}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* إجمالي المشتريات باللون الأخضر */}
                  <TableCell align="center">
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      {customer.totalSales.toLocaleString()} ج.م
                    </Typography>
                  </TableCell>

                  {/* إجمالي المرتجعات باللون الأحمر */}
                  <TableCell align="center">
                    <Typography variant="body2" color="error.main" fontWeight="medium">
                      {customer.totalReturns.toLocaleString()} ج.م
                    </Typography>
                  </TableCell>

                  {/* الصافي بلون مميز */}
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      {(customer.totalSales - customer.totalReturns).toLocaleString()} ج.م
                    </Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography variant="caption" color="text.secondary">
                      {customer.lastPurchase?.split(",")[0] || "---"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">لا يوجد عملاء مطابقين للبحث حالياً</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
