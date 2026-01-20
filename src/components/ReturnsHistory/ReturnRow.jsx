import { useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// مكون الصف المنفصل لإدارة حالة الفتح والغلق لكل عملية مرتجع
export default function ReturnRow({ ret }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell width="50px">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>RET-{ret.id.toString().slice(-4)}</TableCell>
        <TableCell>#{ret.originalInvoiceNumber}</TableCell>
        <TableCell>{ret.returnDate}</TableCell>
        <TableCell>{ret.customerName}</TableCell>
        <TableCell align="left" sx={{ color: "error.main", fontWeight: "bold" }}>
          {ret.totalRefunded.toLocaleString()} ج.م
        </TableCell>
      </TableRow>

      {/* الجزء المنسدل الذي يحتوي على تفاصيل السلع المسترجعة */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, bgcolor: "#fff9f9", p: 2, borderRadius: 2, border: "1px solid #ffebee" }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="error">
                السلع المسترجعة:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>المنتج</TableCell>
                    <TableCell align="center">الكمية المسترجعة</TableCell>
                    <TableCell align="right">سعر الوحدة</TableCell>
                    <TableCell align="right">الإجمالي المسترد</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ret.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price.toLocaleString()} ج.م</TableCell>
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
