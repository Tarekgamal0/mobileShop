import { useState } from "react";
import { Box, Typography, Paper, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useProducts } from "../../contexts/ProductContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// استيراد المكونات الجديدة (تأكد من صحة المسار حسب مجلداتك)
import AddProductDialog from "../../components/InventoryMangement/AddProductDialog";
import EditProductDialog from "../../components/InventoryMangement/EditProductDialog";
import DeleteProductDialog from "../../components/InventoryMangement/DeleteProductDialog";

export default function InventoryMangement() {
  const { products, loading, deleteProduct, updateStock, addProduct, updateProduct } = useProducts();

  // حالات التحكم في فتح وإغلاق النوافذ
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // المنتج المختار للتعديل أو الحذف
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    addProduct({
      ...newProductData,
      price: Number(newProductData.price),
      stock: Number(newProductData.stock),
      minStock: Number(newProductData.minStock),
    });
    setOpenAdd(false);
  };

  const handleSaveEditProduct = (updatedData) => {
    updateProduct(updatedData.id, {
      ...updatedData,
      price: Number(updatedData.price),
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
      field: "price",
      headerName: "السعر",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Typography color="primary.main" fontWeight="bold">
            {params.value?.toLocaleString()} ج.م
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
      renderCell: (params) => (
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
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      {/* Header Section */}
      <Paper
        sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 2 }}
      >
        <Typography variant="h5" fontWeight="bold">
          المخزون الحالي
        </Typography>
        <IconButton
          color="primary"
          sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
          onClick={() => setOpenAdd(true)}
        >
          <AddCircleIcon />
        </IconButton>
      </Paper>

      {/* DataGrid Section */}
      <Paper sx={{ height: 650, width: "100%", borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: true, placeholder: "بحث عن موبايل..." },
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
