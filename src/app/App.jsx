import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { createUseCases } from "../application/useCases.js";
import {
  productRepository,
  createTryOnRepository,
} from "../infrastructure/repositories.js";
import {
  Header,
  Footer,
  CartDialog,
  NotFound,
} from "../presentation/components.jsx";
import { HomePage, ShopPage } from "../presentation/CatalogPages.jsx";
import { DetailPage } from "../presentation/DetailPage.jsx";
import { AppContext } from "../presentation/context.jsx";

const useCases = createUseCases(
  productRepository,
  createTryOnRepository(import.meta.env.VITE_AI_GENERATE_URL || "/api/try-on"),
);

export function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  function addToCart(product, variant) {
    const key = `${product.id}-${variant.code}`;
    setCart((items) => {
      const existing = items.find((item) => item.key === key);
      return existing
        ? items.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...items, { key, product, variant, quantity: 1 }];
    });
    setCartOpen(true);
  }

  return (
    <AppContext
      value={{
        useCases,
        cart,
        setCart,
        addToCart,
        openCart: () => setCartOpen(true),
      }}
    >
      <a className="skip-link" href="#main">
        Lewati navigasi
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppContext>
  );
}
