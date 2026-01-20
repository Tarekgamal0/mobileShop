import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TransactionRow from "./TransactionsRow";

export default function TransactionTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, direction: "ltr" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell width="50px" />
            <TableCell sx={{ fontWeight: "bold" }}>رقم الفاتورة</TableCell>
            <TableCell>التاريخ</TableCell>
            <TableCell>البائع</TableCell>
            <TableCell>العميل</TableCell>
            <TableCell>الدفع</TableCell>
            <TableCell align="left">الإجمالي</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                لا توجد سجلات مطابقة للبحث
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
