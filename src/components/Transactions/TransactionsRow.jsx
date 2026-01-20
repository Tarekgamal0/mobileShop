import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CashIcon from "@mui/icons-material/Payments";
import VisaIcon from "@mui/icons-material/CreditCard";
import TransferIcon from "@mui/icons-material/AccountBalance";

export default function TransactionRow({ transaction }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
            #{transaction.invoiceNumber || "---"}
          </Typography>
        </TableCell>
        <TableCell>{transaction.date}</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>{transaction.seller}</TableCell>
        <TableCell>{transaction.customer?.name}</TableCell>
        <TableCell>
          <Chip
            icon={
              transaction.paymentMethod === "cash" ? (
                <CashIcon />
              ) : transaction.paymentMethod === "visa" ? (
                <VisaIcon />
              ) : (
                <TransferIcon />
              )
            }
            label={
              transaction.paymentMethod === "cash" ? "كاش" : transaction.paymentMethod === "visa" ? "فيزا" : "تحويل"
            }
            color={
              transaction.paymentMethod === "cash"
                ? "success"
                : transaction.paymentMethod === "visa"
                  ? "primary"
                  : "secondary" // لون مختلف للتحويل (مثلاً البنفسجي)
            }
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell align="left" sx={{ fontWeight: "bold", color: "primary.main" }}>
          {transaction.total?.toLocaleString()} ج.م
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                تفاصيل الفاتورة:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>المنتج</TableCell>
                    <TableCell>الكمية</TableCell>
                    <TableCell>السعر</TableCell>
                    <TableCell align="right">الإجمالي</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaction.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price?.toLocaleString()} ج.م</TableCell>
                      <TableCell align="right">{(item.quantity * item.price).toLocaleString()} ج.م</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
