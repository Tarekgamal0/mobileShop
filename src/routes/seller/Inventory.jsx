import { Box, Typography, Paper, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useProducts } from "../../contexts/ProductContext";

export default function InventoryMangement() {
  const { products, loading } = useProducts();

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
  ];

  return (
    <Box sx={{ p: 3, direction: "ltr" }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", direction: "ltr", color: "primary.main" }}>
        المخزون الحالي
      </Typography>

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
    </Box>
  );
}
