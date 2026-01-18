import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthContext.jsx";

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { UserProvider } from "./contexts/UserContext.jsx";
import ProductProvider from "./contexts/ProductContext.jsx";
// 1. إنشاء Cache يدعم الـ RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// import { store } from "./app/store";
// import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CacheProvider value={cacheRtl}>
        <AuthProvider>
          <UserProvider>
            <ProductProvider>
              <App />
            </ProductProvider>
          </UserProvider>
        </AuthProvider>
      </CacheProvider>
    </BrowserRouter>
  </StrictMode>,
);
