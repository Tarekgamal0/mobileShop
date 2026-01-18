import React, { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../mocks/products.json";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
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

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        updateStock,
        updateProduct, // تأكد من تصدير الدالة هنا
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
