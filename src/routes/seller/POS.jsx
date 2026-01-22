import { useState } from "react";
import { Box, Grid, Paper, TextField, InputAdornment, Typography, Button, Stack } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useProducts } from "../../contexts/ProductContext";

import ProductList from "../../components/POS/ProductList";
import CartSidebar from "../../components/POS/CartSidebar";
import CustomerDialog from "../../components/POS/CustomerDialog";
import { useAuth } from "../../contexts/AuthContext";
import SearchField from "../../components/shared/SearchField";
import { useTransactions } from "../../contexts/TransactionsContext";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ZReportDialog from "../../components/POS/ZReportDialog";

export default function POS() {
  const { products, adjustStock, confirmSale } = useProducts();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const { user } = useAuth();
  const { addTransaction } = useTransactions(); // جلب وظيفة الإضافة

  const [openZReport, setOpenZReport] = useState(false);

  // التأكد من أن المستخدم مدير أو لديه صلاحية التقارير
  const canCloseDay = user?.role === "owner" || user?.permissions?.includes("reports_view");

  // إضافة منتج للسلة
  const addToCart = (product) => {
    // خصم 1 من المخزن العام
    adjustStock(product.id, -1);

    // تحديث السلة
    setCart((prev) => {
      // تحقق إذا كان المنتج موجوداً بالفعل في السلة
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // if (product.stock <= 0) return alert("المنتج غير متوفر في المخزن!");
  };

  // 2. حذف منتج واحد من السلة (يرجع للمخزن)
  const removeFromCart = (itemId) => {
    const itemInCart = cart.find((i) => i.id === itemId);
    if (!itemInCart) return;

    // إرجاع 1 للمخزن
    adjustStock(itemId, 1);

    setCart((prev) => {
      if (itemInCart.quantity > 1) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)); // نقص 1 فقط
      }
      return prev.filter((i) => i.id !== itemId); // حذف العنصر بالكامل
    });
  };

  // 3. إلغاء السلة بالكامل (إرجاع كل الكميات للمخزن)
  const handleCancelSale = () => {
    cart.forEach((item) => {
      adjustStock(item.id, item.quantity);
    });
    setCart([]);
  };

  // 4. إتمام البيع
  const handleFinalCheckout = () => {
    // تحضير بيانات العملية الحالية
    const saleData = {
      id: Date.now(), // إضافة ID فريد لكل عملية
      date: new Date().toLocaleString(),
      items: cart,
      total: totalPrice,
      paymentMethod: paymentMethod,
      seller: user.name || "بائع غير معروف",
      customer: {
        name: customerName || "عميل نقدي", // اسم افتراضي إذا لم يدخل اسم
        phone: customerPhone || "غير مسجل",
      },
    };

    // استخدام الـ Context للحفظ
    const success = addTransaction(saleData);

    // إرسال البيانات للـ Context (إذا كنت لا تزال تستخدمه)
    if (success) {
      confirmSale(saleData);
      setCart([]);
      setPaymentMethod("cash");
      setCustomerName("");
      setCustomerPhone("");
      setOpenCheckoutDialog(false);
      alert(`تمت العملية بنجاح وحفظها في السجلات!`);
    }
  };

  // حساب الإجمالي الكلي وعدد القطع
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
          نقطة البيع
        </Typography>

        {canCloseDay && (
          <Button variant="contained" color="error" startIcon={<SummarizeIcon />} onClick={() => setOpenZReport(true)}>
            إغلاق اليومية (Z-Report)
          </Button>
        )}
      </Stack>
      <SearchField
        placeholder="ابحث عن موديل أو ماركة..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Grid container spacing={3}>
        {/* قائمة المنتجات */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ProductList products={products} searchQuery={searchQuery} onAddToCart={addToCart} />
        </Grid>

        {/* السلة مع الإجمالي */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSidebar
            cart={cart}
            totalPrice={totalPrice}
            totalItems={totalItems}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onRemoveOne={removeFromCart}
            onCancel={handleCancelSale}
            onCheckout={() => setOpenCheckoutDialog(true)}
          />
        </Grid>
      </Grid>
      <CustomerDialog
        open={openCheckoutDialog}
        onClose={() => setOpenCheckoutDialog(false)}
        onConfirm={handleFinalCheckout}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
      />
      <ZReportDialog open={openZReport} onClose={() => setOpenZReport(false)} />
    </Box>
  );
}
