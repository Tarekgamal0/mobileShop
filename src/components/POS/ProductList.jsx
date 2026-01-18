import { Grid, Paper, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ProductList({ products, searchQuery, onAddToCart }) {
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      {uniqueCategories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category === category && p.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        if (categoryProducts.length === 0) return null;

        return (
          <Accordion key={category} sx={{ mb: 1, borderRadius: "8px !important" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {category} ({categoryProducts.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {categoryProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                    <Paper
                      elevation={1}
                      sx={{ p: 2, textAlign: "center", borderRadius: 2, opacity: product.stock === 0 ? 0.6 : 1 }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography color="primary">{product.price.toLocaleString()} ج.م</Typography>
                      <Typography variant="caption" display="block">
                        المخزن: {product.stock}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={product.stock <= 0}
                        onClick={() => onAddToCart(product)}
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
    </>
  );
}
