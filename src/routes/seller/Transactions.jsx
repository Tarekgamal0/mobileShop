import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import SearchField from "../../components/shared/SearchField";
import TransactionTable from "../../components/Transactions/TransactionTable";
import { useTransactions } from "../../contexts/TransactionsContext";

export default function Transactions() {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  // فلترة العمليات بناءً على اسم العميل، البائع، أو التاريخ
  const filteredTransactions = transactions.filter(
    (t) =>
      t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.date.includes(searchTerm),
  );

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        سجل المبيعات
      </Typography>

      <SearchField
        placeholder="ابحث باسم العميل، البائع، أو التاريخ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TransactionTable data={filteredTransactions} />
    </Box>
  );
}
