import { useMemo, useState } from "react";
import { Box, Typography, Paper, Chip, Stack, IconButton, Tooltip, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useProducts } from "../../contexts/ProductContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// استيراد المكونات الجديدة (تأكد من صحة المسار حسب مجلداتك)
import AddProductDialog from "../../components/Inventory/AddProductDialog";
import EditProductDialog from "../../components/Inventory/EditProductDialog";
import DeleteProductDialog from "../../components/Inventory/DeleteProductDialog";
import { useAuth } from "../../contexts/AuthContext";
import SearchField from "../../components/shared/SearchField";
import { formatCurrency } from "../../utils/formatters";

export default function Inventory() {
  const { products, loading, deleteProduct, addProduct, updateProduct } = useProducts();

  const { user } = useAuth();

  // فحص الصلاحيات (نفترض أن الأكواد هي inventory_edit و inventory_delete)
  const canEdit = user?.role === "owner" || user?.permissions?.includes("inventory_edit");

  // حالات التحكم في فتح وإغلاق النوافذ
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // المنتج المختار للتعديل أو الحذف
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- منطق تصفية المنتجات (Search Logic) ---
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term));
  }, [products, searchTerm]);

  // --- دوال التحكم ---

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  const handleSaveNewProduct = (newProductData) => {
    const origPrice = Number(newProductData.price) || 0;
    const disc = Number(newProductData.discount) || 0;
    addProduct({
      ...newProductData,
      originalPrice: origPrice,
      discount: disc,
      price: origPrice - (origPrice * disc) / 100,
      stock: Number(newProductData.stock),
      minStock: Number(newProductData.minStock),
    });
    setOpenAdd(false);
  };

  const handleSaveEditProduct = (updatedData) => {
    const origPrice = Number(updatedData.price) || 0;
    const disc = Number(updatedData.discount) || 0;
    updateProduct(updatedData.id, {
      ...updatedData,
      originalPrice: origPrice,
      discount: disc,
      price: origPrice - (origPrice * disc) / 100,
      stock: Number(updatedData.stock),
      minStock: Number(updatedData.minStock),
    });
    setOpenEdit(false);
  };

  const columns = [
    {
      field: "brand",
      headerName: "الماركة",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <Chip label={params.value} variant="outlined" size="small" />,
    },
    { field: "name", headerName: "الموديل", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "originalPrice",
      headerName: "السعر",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Typography color="primary.main" fontWeight="bold">
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "discount",
      headerName: "الخصم",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value || 0;
        return value > 0 ? (
          <Chip label={`${value}%-`} color="error" size="small" sx={{ fontWeight: "bold", borderRadius: 1 }} />
        ) : (
          <Typography variant="caption" color="text.disabled">
            0%
          </Typography>
        );
      },
    },
    {
      field: "price",
      headerName: "صافي السعر",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Typography color="success.main" fontWeight="bold">
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "stock",
      headerName: "الكمية",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isLow = params.row.stock <= params.row.minStock;
        return (
          <Box
            sx={{
              bgcolor: isLow ? "error.light" : "success.light",
              color: isLow ? "error.dark" : "success.dark",
              px: 2,
              borderRadius: 1,
              fontWeight: "bold",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "إجراءات",
      width: 120,
      headerAlign: "center",
      align: "center",
      sortable: false,
      hide: !canEdit,
      renderCell: (params) => {
        // إذا لم يكن لديه صلاحية، لا نعرض شيئاً أو نعرض نصاً بسيطاً
        if (!canEdit) {
          return (
            <Typography variant="caption" color="text.disabled">
              ممنوع
            </Typography>
          );
        }

        return (
          <Box>
            <Tooltip title="تعديل تفصيلي">
              <IconButton size="small" color="primary" onClick={() => handleEditClick(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="حذف">
              <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          إدارة المخزون الحالي
        </Typography>

        {/* زر الإضافة يظهر فقط إذا كان لديه صلاحية canEdit */}
        {canEdit && (
          <Button
            variant="contained"
            size="large" // تكبير الحجم الافتراضي
            startIcon={<AddCircleIcon sx={{ fontSize: "24px !important" }} />} // تكبير الأيقونة
            onClick={() => setOpenAdd(true)}
            sx={{
              borderRadius: 3,
              px: 4, // زيادة المسافة الأفقية داخل الزر
              py: 1.5, // زيادة المسافة الرأسية
              fontSize: "1.1rem", // تكبير حجم الخط
              fontWeight: "bold",
              boxShadow: 3, // إضافة ظل لإعطاء عمق
              "&:hover": {
                boxShadow: 5,
                transform: "scale(1.02)", // تأثير حركة بسيط عند المرور بالماوس
              },
              transition: "all 0.2s",
            }}
          >
            إضافة منتج جديد
          </Button>
        )}
      </Box>
      <SearchField
        placeholder="ابحث باسم الموديل أو الماركة..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* DataGrid Section */}
      <Paper sx={{ height: 600, width: "100%", borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          loading={loading}
          columnVisibilityModel={{
            // العمود 'actions' سيكون مرئياً فقط إذا كان canEdit يساوي true
            actions: canEdit,
          }}
        />
      </Paper>

      {/* --- استدعاء المكونات المنفصلة --- */}

      <AddProductDialog open={openAdd} onClose={() => setOpenAdd(false)} onSave={handleSaveNewProduct} />

      <EditProductDialog
        open={openEdit}
        product={selectedProduct}
        onClose={() => setOpenEdit(false)}
        onSave={handleSaveEditProduct}
      />

      <DeleteProductDialog
        open={openDelete}
        productName={selectedProduct?.name}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          // التحقق من وجود المنتج والـ id قبل الاستدعاء
          if (selectedProduct?.id) {
            deleteProduct(selectedProduct.id);
            setOpenDelete(false);
          }
        }}
      />
    </Box>
  );
}
