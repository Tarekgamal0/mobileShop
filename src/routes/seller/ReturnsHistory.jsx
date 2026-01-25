import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTransactions } from "../../contexts/TransactionsContext";
import ReturnRow from "../../components/ReturnsHistory/ReturnRow";
import { useMemo, useState } from "react";
import SearchField from "../../components/shared/SearchField";
import { formatDate } from "../../utils/formatters";

// هيكل مقترح لصفحة المرتجعات
export default function ReturnsHistory() {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  const returnTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === "return");
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return returnTransactions.filter((t) => {
      // تحويل القيم إلى نصوص بأمان لتجنب الأخطاء إذا كانت القيمة null أو undefined
      const invoiceNo = t.invoiceNumber?.toString() || "";
      const customerName = t.customer?.name?.toLowerCase() || "عميل نقدي";
      const sellerName = t.seller?.toLowerCase() || "";
      const dateStr = formatDate(t.date) || "";

      return (
        invoiceNo.includes(term) || customerName.includes(term) || sellerName.includes(term) || dateStr.includes(term)
      );
    });
  }, [returnTransactions, searchTerm]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        سجل المرتجعات
      </Typography>

      <SearchField
        placeholder="ابحث برقم الفاتورة، اسم العميل، البائع، أو التاريخ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, direction: "ltr" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fff5f5" }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: "bold" }}>رقم المرتجع</TableCell>
              <TableCell>الفاتورة الأصلية</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>العميل</TableCell>
              <TableCell align="left">المبلغ المسترد</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((ret) => <ReturnRow key={ret.id} ret={ret} />)
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  لا توجد عمليات استرجاع مسجلة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
