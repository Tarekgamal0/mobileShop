import React, { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../mocks/products.json";

const ProductContext = createContext();

export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات عند البداية
  useEffect(() => {
    const saved = localStorage.getItem("app_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("app_products", JSON.stringify(initialProducts));
    }
    setLoading(false);
  }, []);

  // حفظ تلقائي عند أي تغيير
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("app_products", JSON.stringify(products));
    }
  }, [products, loading]);

  // إضافة منتج جديد
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts([...products, newProduct]);
  };

  // حذف منتج
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // تحديث كمية (للتعديل السريع في الجدول)
  const updateStock = (id, newStock) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  };

  // --- الدالة الجديدة: تحديث منتج بالكامل ---
  const updateProduct = (id, updatedData) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  const sellProducts = (cartItems) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const itemInCart = cartItems.find((item) => item.id === product.id);
        if (itemInCart) {
          // خصم الكمية المباعة من المخزون
          return { ...product, stock: product.stock - itemInCart.quantity };
        }
        return product;
      });
    });
  };

  // دالة لتعديل المخزون مؤقتاً (زيادة أو نقصان)
  const adjustStock = (id, amount) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p)));
  };

  // عند إتمام البيع نهائياً (حالياً لا نحتاج لتغيير المخزن لأننا عدلناه أثناء الإضافة للسلة)
  const confirmSale = (cartItems) => {
    console.log("تم تأكيد البيع نهائياً:", cartItems);
    // هنا يمكنك حفظ الفاتورة في قاعدة البيانات أو localStorage
  };

  
  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        deleteProduct,
        updateStock,
        updateProduct, // تأكد من تصدير الدالة هنا
        sellProducts,
        adjustStock,
        confirmSale,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  return useContext(ProductContext);
};
