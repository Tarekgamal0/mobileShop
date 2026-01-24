import { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";

import SearchField from "../../components/shared/SearchField";
import TransactionTable from "../../components/Transactions/TransactionTable";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Transactions() {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  // فحص صلاحية الاسترجاع
  const canReturn = user?.role === "owner" || user?.permissions?.includes("transactions_return");

  const saleTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === "sale");
  }, [transactions]);

  // فلترة العمليات بناءً على اسم العميل، البائع، أو التاريخ
  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return saleTransactions.filter((t) => {
      // تحويل القيم إلى نصوص بأمان لتجنب الأخطاء إذا كانت القيمة null أو undefined
      const invoiceNo = t.invoiceNumber?.toString() || "";
      const customerName = t.customer?.name?.toLowerCase() || "عميل نقدي";
      const sellerName = t.seller?.toLowerCase() || "";
      const dateStr = t.date || "";

      return (
        invoiceNo.includes(term) || customerName.includes(term) || sellerName.includes(term) || dateStr.includes(term)
      );
    });
  }, [saleTransactions, searchTerm]);

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        سجل المبيعات
      </Typography>

      <SearchField
        placeholder="ابحث برقم الفاتورة، اسم العميل، البائع، أو التاريخ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TransactionTable data={filteredTransactions} canReturn={canReturn} />
    </Box>
  );
}
