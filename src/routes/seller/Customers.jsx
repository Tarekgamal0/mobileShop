import React, { useState } from "react";
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
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useTransactions } from "../../contexts/TransactionsContext";
import SearchField from "../../components/shared/SearchField";

export default function Customers() {
  const { getUniqueCustomers } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  // جلب بيانات العملاء من الـ Context
  const customers = getUniqueCustomers();

  // فلترة العملاء بناءً على الاسم أو رقم التليفون
  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm),
  );

  return (
    <Box sx={{ p: 4, direction: "rtl" }}>
      {/* العنوان وإحصائية سريعة */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        قائمة العملاء
      </Typography>
      {/* شريط البحث */}
      <SearchField
        placeholder="ابحث باسم العميل أو رقم التليفون..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* جدول العملاء */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, direction: "ltr" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>العميل</TableCell>
              <TableCell>رقم التليفون</TableCell>
              <TableCell align="center">عدد المعاملات</TableCell>
              <TableCell align="center">إجمالي المشتريات</TableCell>
              <TableCell>تاريخ آخر عملية</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography fontWeight="medium">{customer.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography>{customer.phone}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<ShoppingBagIcon sx={{ fontSize: "14px !important" }} />}
                      label={customer.transactionsCount}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "success.main" }}>
                    {customer.totalSpent.toLocaleString()} ج.م
                  </TableCell>
                  <TableCell color="text.secondary">
                    {customer.lastPurchase.split(",")[0]} {/* عرض التاريخ بدون الوقت */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">لا يوجد عملاء مطابقين للبحث</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
