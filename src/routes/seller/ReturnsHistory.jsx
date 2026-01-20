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

// هيكل مقترح لصفحة المرتجعات
export default function ReturnsHistory() {
  const { returns } = useTransactions();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        سجل المرتجعات
      </Typography>
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
            {returns.length > 0 ? (
              returns.map((ret) => <ReturnRow key={ret.id} ret={ret} />)
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
