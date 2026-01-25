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
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CashIcon from "@mui/icons-material/Payments";
import VisaIcon from "@mui/icons-material/CreditCard";
import TransferIcon from "@mui/icons-material/AccountBalance";
import ReturnDialog from "./ReturnDialog";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useProducts } from "../../contexts/ProductContext";
import UndoIcon from "@mui/icons-material/Undo";
import { formatDate, formatCurrency } from "../../utils/formatters";

export default function TransactionRow({ transaction, canReturn }) {
  const [open, setOpen] = useState(false);

  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const { addReturn } = useTransactions();
  const { adjustStock } = useProducts();

  const handleReturnConfirm = (returnData) => {
    const success = addReturn(returnData, adjustStock);
    if (success) {
      setReturnDialogOpen(false);
      alert("تم تسجيل المرتجع وتحديث المخزن بنجاح");
    }
  };
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
        <TableCell>{formatDate(transaction.date)}</TableCell>
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
          {formatCurrency(transaction.total)}
        </TableCell>
        {canReturn && (
          <TableCell align="center">
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<UndoIcon />}
              onClick={() => setReturnDialogOpen(true)}
            >
              استرجاع
            </Button>
          </TableCell>
        )}
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
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.quantity * item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ReturnDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        transaction={transaction}
        onConfirm={handleReturnConfirm}
      />
    </>
  );
}
