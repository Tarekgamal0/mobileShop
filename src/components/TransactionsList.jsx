import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function TransactionsList({ transactions }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 1 }}>
        <Typography variant="caption" fontWeight="bold">
          سجل العمليات التفصيلي
        </Typography>
      </Divider>
      <TableContainer
        component={Paper}
        variant="outlined"
        className="print-table"
        sx={{ maxHeight: 200, overflowY: "auto" }}
      >
        <Table size="small" stickyHeader sx={{ direction: "ltr" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>رقم</TableCell>
              <TableCell sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>النوع</TableCell>
              <TableCell sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>المبلغ</TableCell>
              <TableCell sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>الدفع</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ fontSize: "0.7rem" }}>{t.invoiceNumber || t.InvoiceNumber}</TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>
                  <Typography
                    variant="caption"
                    color={t.type === "sale" ? "success.main" : "error.main"}
                    fontWeight="bold"
                  >
                    {t.type === "sale" ? "بيع" : "مرتجع"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                  {t.type === "sale" ? `+${t.total.toLocaleString()}` : `-${t.total.toLocaleString()}`}
                </TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>
                  {t.paymentMethod === "cash" ? "كاش" : t.paymentMethod === "visa" ? "فيزا" : "تحويل"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
