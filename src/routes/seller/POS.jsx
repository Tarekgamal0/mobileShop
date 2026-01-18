import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useProducts } from "../../contexts/ProductContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function POS() {
  const { products, adjustStock, confirmSale } = useProducts();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  // إضافة منتج للسلة
  const addToCart = (product) => {
    // جلب أحدث بيانات للمنتج من القائمة (للتأكد من المخزن الحالي)
    const currentProduct = products.find((p) => p.id === product.id);

    // if (currentProduct.stock <= 0) {
    //   alert("عذراً، نفدت الكمية من المخزن!");
    //   return;
    // }

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
  const handleCheckout = () => {
    confirmSale(cart);
    setCart([]);
    alert("تمت العملية بنجاح!");
  };

  // فلترة المنتجات حسب البحث
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // حساب الإجمالي الكلي وعدد القطع
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="ابحث عن موديل أو ماركة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "#fbfbfb" }}
        />
      </Paper>
      <Grid container spacing={3}>
        {/* قائمة المنتجات */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* 2. عرض المجموعات (Categories Accordions) */}
          {uniqueCategories.map((category) => {
            // فلترة المنتجات التابعة لهذه الفئة فقط والتي تطابق البحث أيضاً
            const categoryProducts = products.filter(
              (p) => p.category === category && p.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );

            // إذا كانت الفئة لا تحتوي على منتجات تطابق البحث، لا نعرضها
            if (categoryProducts.length === 0) return null;

            return (
              <Accordion key={category} sx={{ mb: 1, borderRadius: "8px !important", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5", borderRadius: "8px" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {category} ({categoryProducts.length})
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {categoryProducts.map((product) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            border: "1px solid #eee",
                            borderRadius: 2,
                            opacity: product.stock === 0 ? 0.6 : 1,
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            {product.name}
                          </Typography>
                          <Typography color="primary" sx={{ my: 0.5 }}>
                            {product.price.toLocaleString()} ج.م
                          </Typography>
                          <Typography variant="caption" display="block">
                            المخزن: {product.stock}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            disabled={product.stock <= 0}
                            onClick={() => addToCart(product)}
                          >
                            إضافة
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>

        {/* السلة مع الإجمالي */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: "fit-content" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              الفاتورة الحالية
            </Typography>
            <Divider />

            <List sx={{ flexGrow: 1, overflow: "auto", maxHeight: "400px" }}>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                      <RemoveCircleIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × {item.price.toLocaleString()} =
                        <b style={{ color: "#1976d2" }}> {(item.quantity * item.price).toLocaleString()} ج.م</b>
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {cart.length > 0 && (
              <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, mt: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>عدد الأصناف:</Typography>
                    <Typography fontWeight="bold">{cart.length}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>إجمالي القطع:</Typography>
                    <Typography fontWeight="bold">{totalItems}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
                    <Typography variant="h6">الإجمالي:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {totalPrice.toLocaleString()} ج.م
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Stack spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth size="large" onClick={handleCheckout} disabled={cart.length === 0}>
                تأكيد العملية
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="error"
                onClick={handleCancelSale}
                disabled={cart.length === 0}
              >
                إلغاء الفاتورة
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
