import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate, formatCurrency } from "../../utils/formatters";

export default function ReturnDialog({ open, onClose, transaction, onConfirm }) {
  // تخزين الكميات المراد إرجاعها (بشكل افتراضي 0 لكل الأصناف)
  const [returnQuantities, setReturnQuantities] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (transaction) {
      const initialQtys = {};
      transaction.items.forEach((item) => {
        initialQtys[item.id] = 0; // البداية دائماً صفر
      });
      setReturnQuantities(initialQtys);
    }
  }, [transaction]);

  // التعامل مع تغيير الكمية في حقل الإدخال
  const handleQtyChange = (itemId, val, max) => {
    const value = Math.max(0, Math.min(max, Number(val))); // ضمان عدم تجاوز الكمية الأصلية
    setReturnQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleProcess = () => {
    // (حدث لها ارجاع) تصفية الأصناف التي كميتها أكبر من 0 فقط
    const itemsToReturn = transaction.items
      .filter((item) => returnQuantities[item.id] > 0)
      .map((item) => ({
        ...item,
        quantity: returnQuantities[item.id], // الكمية الجديدة المسترجعة
      }));

    if (itemsToReturn.length === 0) return alert("يرجى تحديد كمية صنف واحد على الأقل");

    const totalRefunded = itemsToReturn.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const returnData = {
      id: Date.now(), // إضافة ID فريد لكل عملية
      date: new Date().toLocaleString(),
      items: itemsToReturn,
      total: totalRefunded,
      paymentMethod: "cash",
      seller: user.name || "بائع غير معروف",
      customer: {
        name: transaction.customer.name || "عميل نقدي", // اسم افتراضي إذا لم يدخل اسم
        phone: transaction.customer.phone || "غير مسجل",
      },
      InvoiceNumber: transaction.invoiceNumber,
    };
    onConfirm(returnData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl" disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: "bold" }}>إرجاع أصناف من الفاتورة #{transaction?.invoiceNumber}</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          حدد الكمية التي تريد إرجاعها من كل صنف أدناه. (الكمية المتاحة = الكمية الأصلية - المسترجع سابقاً)
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>المنتج</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الكمية الأصلية
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "error.main" }}>
                مسترجع سابقاً
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الكمية المراد إرجاعها
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                سعر الوحدة
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                إجمالي المسترد
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction?.items.map((item) => {
              // حساب الكمية المتاحة للاسترجاع حالياً
              const alreadyReturned = item.returnedQuantity || 0;
              const remainingQty = item.quantity - alreadyReturned;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", fontWeight: "medium" }}>
                    {alreadyReturned}
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      // تعطيل الحقل إذا تم إرجاع الكمية بالكامل سابقاً
                      disabled={remainingQty <= 0}
                      value={returnQuantities[item.id] || 0}
                      onChange={(e) => handleQtyChange(item.id, e.target.value, remainingQty)}
                      slotProps={{
                        input: {
                          style: { textAlign: "center" },
                          min: 0,
                          max: remainingQty,
                        },
                      }}
                      helperText={remainingQty <= 0 ? "مسترجع بالكامل" : ""}
                      sx={{ width: "100px" }}
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{formatCurrency((returnQuantities[item.id] || 0) * item.price)}</TableCell>
                </TableRow>
              );
            })}

            {/* صف إجمالي المسترد */}
            <TableRow sx={{ bgcolor: "#fff5f5" }}>
              <TableCell colSpan={5} align="left" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                إجمالي المبلغ المسترد للعميل في هذه العملية:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "error.main" }}>
                {formatCurrency(
                  transaction?.items.reduce((sum, item) => sum + (returnQuantities[item.id] || 0) * item.price, 0),
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button
          onClick={handleProcess}
          variant="contained"
          color="error"
          // تعطيل الزر إذا لم يتم اختيار أي كميات للإرجاع
          disabled={!Object.values(returnQuantities).some((qty) => qty > 0)}
        >
          تأكيد المرتجع
        </Button>
      </DialogActions>
    </Dialog>
  );
}
