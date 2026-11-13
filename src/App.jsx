import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { useState, useEffect, useCallback } from "react";

// ==========================================
// COMPONENT IMPORTS
// ==========================================

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import MyCard from "./components/My-card/MyCard";
import Footer from "./components/Footer/Footer";
import MenuFooter from "./components/Menufooter/MenuFooter";
import Login from "./components/Login/Login";
import CardEmp from "./components/My-card/CardEmp";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Contact from "./components/Contact/Contact";
import Category from "./components/ShopNow/Category";
import Blog from "./components/Blog/Blog";
import BlogDetails from "./components/Blog/BlogDetails";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import AboutUs from "./components/About Us/AboutUs";
import Wishlist from "./components/Wishlist/Wishlist";
import Checkout from "./components/My-card/Checkout/Checkout";
import OrderHistory from "./components/Wishlist/OrderHistory/OrderHistory";
import Payment from "./components/Payment/Payment";
import Deals, { immunityProducts } from "./components/Deals/Deals";
import ProductCard from "./components/Product-Card/ProductCard";
import Notification from "./components/Notification/Notification";
import Signup from "./components/Signup/Signup";

// ==========================================
// WISHLIST API
// ==========================================

const WISHLIST_API =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend/api/wishlist.php";

// ==========================================
// GUEST TOKEN
// ==========================================

const getGuestToken = () => {
  let token = localStorage.getItem("guest_token");

  if (!token) {
    const randomId = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Date.now() + "_" + Math.random().toString(36).slice(2);

    token = "guest_" + randomId;

    localStorage.setItem("guest_token", token);
  }

  return token;
};

// ==========================================
// APP LAYOUT
// ==========================================

function AppLayout() {
  const location = useLocation();

  // Hide Header and Footer on Signup page
  const hideHeaderFooter = location.pathname === "/Signup";

  // ========================================
  // GLOBAL STATES
  // ========================================

  const [cartItems, setCartItems] = useState([]);

  const [wishlistItems, setWishlistItems] = useState([]);

  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  const [guestToken] = useState(getGuestToken);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  // ========================================
  // ADD TO CART
  // ========================================

  const addToCart = useCallback((product) => {
    setCartItems((previous) => {
      const existing = previous.find(
        (item) => String(item.id) === String(product.id),
      );

      if (existing) {
        return previous.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 1) +
                  (Number(product.quantity) || 1),
              }
            : item,
        );
      }

      return [
        ...previous,
        {
          ...product,
          quantity: Number(product.quantity) || 1,
        },
      ];
    });
  }, []);

  // ========================================
  // REMOVE FROM CART
  // ========================================

  const removeFromCart = useCallback((id) => {
    setCartItems((previous) =>
      previous.filter((product) => String(product.id) !== String(id)),
    );
  }, []);

  // ========================================
  // UPDATE CART QUANTITY
  // ========================================

  const updateCartQuantity = useCallback((id, quantity) => {
    setCartItems((previous) =>
      previous.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantity: Math.max(1, Number(quantity) || 1),
            }
          : item,
      ),
    );
  }, []);

  // ========================================
  // FETCH WISHLIST FROM DATABASE
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchWishlist = async () => {
      try {
        const response = await fetch(
          `${WISHLIST_API}?guest_token=${encodeURIComponent(guestToken)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to fetch wishlist.");
        }

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid wishlist data.");
        }

        setWishlistItems(result.data);
        setWishlistLoaded(true);

        console.log("Wishlist loaded successfully:", result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Wishlist Fetch Error:", error);
        }
      }
    };

    fetchWishlist();

    return () => {
      controller.abort();
    };
  }, [guestToken]);

  // ========================================
  // UPDATE WISHLIST
  // Supports both array and function updates
  // ========================================

  const updateWishlist = useCallback((value) => {
    setWishlistItems((previous) => {
      const updatedItems =
        typeof value === "function" ? value(previous) : value;

      return Array.isArray(updatedItems) ? updatedItems : previous;
    });
  }, []);

  // ========================================
  // SAVE WISHLIST TO DATABASE
  // ========================================

  useEffect(() => {
    // Wait until initial database fetch finishes.
    if (!wishlistLoaded) return;

    const controller = new AbortController();

    const saveWishlist = async () => {
      try {
        const response = await fetch(
          `${WISHLIST_API}?guest_token=${encodeURIComponent(guestToken)}`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              items: wishlistItems,
            }),

            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Wishlist save failed.");
        }

        console.log("Wishlist saved successfully:", result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Wishlist Save Error:", error);
        }
      }
    };

    // Small delay to combine rapid wishlist changes.
    const timer = setTimeout(saveWishlist, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [wishlistItems, wishlistLoaded, guestToken]);

  // ========================================
  // TOGGLE WISHLIST
  // ADD / REMOVE PRODUCT
  // ========================================

  const toggleWishlist = useCallback(
    (product) => {
      updateWishlist((previous) => {
        const exists = previous.some(
          (item) => String(item.id) === String(product.id),
        );

        if (exists) {
          return previous.filter(
            (item) => String(item.id) !== String(product.id),
          );
        }

        return [
          ...previous,
          {
            ...product,
            inStock: product.inStock ?? Number(product.stock) > 0,
          },
        ];
      });
    },
    [updateWishlist],
  );

  // ========================================
  // REMOVE FROM WISHLIST
  // ========================================

  const removeFromWishlist = useCallback(
    (id) => {
      updateWishlist((previous) =>
        previous.filter((item) => String(item.id) !== String(id)),
      );
    },
    [updateWishlist],
  );

  // ========================================
  // PLACE ORDER
  // ========================================

  const placeOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,

      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "Processing",

      payment: "Paid",

      total: orderData.total,

      products: orderData.products.map((product) => ({
        ...product,
        quantity: Number(product.quantity) || 1,
        price: Number(product.price) || 0,
      })),
    };

    setOrders((previous) => [newOrder, ...previous]);

    setCartItems([]);
  }, []);

  // ========================================
  // HEADER PROPS
  // ========================================

  const headerProducts = [...products, ...immunityProducts];

  // ========================================
  // APP UI
  // ========================================

  return (
    <>
      <ScrollToTop />

      {/* ==================================
          HEADER
      ================================== */}

      {!hideHeaderFooter && (
        <Header
          products={headerProducts}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
        />
      )}

      {/* ==================================
          ROUTES
      ================================== */}

      <Routes>
        {/* HOME */}

        <Route
          path="/"
          element={
            <Home
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
              onProductsChange={setProducts}
            />
          }
        />

        <Route
          path="/Home"
          element={
            <Home
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
              onProductsChange={setProducts}
            />
          }
        />

        {/* SIGNUP */}

        <Route path="/Signup" element={<Signup />} />

        {/* LOGIN */}

        <Route path="/Login" element={<Login />} />

        {/* DEALS */}

        <Route
          path="/deals"
          element={
            <Deals
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
            />
          }
        />

        {/* CONTACT */}

        <Route path="/contact" element={<Contact />} />

        {/* BLOG */}

        <Route path="/Blog" element={<Blog />} />

        <Route path="/blog/:id" element={<BlogDetails />} />

        {/* ABOUT */}

        <Route path="/AboutUs" element={<AboutUs />} />

        {/* CARD */}

        <Route path="/CardEmp" element={<CardEmp />} />

        {/* CATEGORY */}

        <Route
          path="/Category"
          element={
            <Category
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
            />
          }
        />

        {/* NOTIFICATION */}

        <Route path="/Notification" element={<Notification />} />

        {/* WISHLIST */}

        <Route
          path="/Wishlist"
          element={
            <Wishlist
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
              onAddToCart={addToCart}
              onRemoveFromWishlist={removeFromWishlist}
              orders={orders}
            />
          }
        />

        {/* VIEW PRODUCT */}

        <Route
          path="/ViewProduct"
          element={
            <ViewProduct
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
            />
          }
        />

        {/* PRODUCT CARD */}

        <Route
          path="/ProductCard"
          element={
            <ProductCard
              onProductsChange={setProducts}
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={updateWishlist}
            />
          }
        />

        {/* ORDER HISTORY */}

        <Route
          path="/OrderHistory"
          element={<OrderHistory orders={orders} />}
        />

        {/* MY CART */}

        <Route
          path="/Mycard"
          element={
            <MyCard
              cartItems={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
            />
          }
        />

        {/* CHECKOUT */}

        <Route
          path="/Checkout"
          element={
            <Checkout
              cartItems={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onPlaceOrder={placeOrder}
            />
          }
        />

        {/* PAYMENT */}

        <Route
          path="/Payment"
          element={<Payment onPlaceOrder={placeOrder} />}
        />

        {/* FOOTER */}

        <Route path="/Footer" element={<Footer />} />

        {/* MOBILE FOOTER */}

        <Route
          path="/MenuFooter"
          element={
            <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
          }
        />

        {/* STATIC PAGES */}

        <Route path="/about" element={<h1>About Us</h1>} />

        <Route path="/privacy-policy" element={<h1>Privacy Policy</h1>} />

        <Route
          path="/delivery-shipping"
          element={<h1>Delivery &amp; Shipping</h1>}
        />

        <Route path="/terms" element={<h1>Terms &amp; Conditions</h1>} />

        <Route path="/refund-policy" element={<h1>Refund Policy</h1>} />

        <Route path="/publications" element={<h1>Publications</h1>} />
      </Routes>

      {/* ==================================
          FOOTER
      ================================== */}

      {!hideHeaderFooter && (
        <>
          <Footer />

          <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
        </>
      )}
    </>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
