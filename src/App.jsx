import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

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
import Account from "./components/Wishlist/Account/Account";

import { createNotification } from "./utils/notificationService";

// =====================================
// API CONFIGURATION
// =====================================

const CART_API = "https://akshayurja.in/ExpensesApp/ShaheedApis/cart.php";

const WISHLIST_API =
  "https://akshayurja.in/ExpensesApp/ShaheedApis/wishlist.php";

const ORDERS_API =
  "https://akshayurja.in/ExpensesApp/ShaheedApis/CustomerOrder_history.php";

// GET LOGGED-IN USER ID
// =====================================

const getLoggedInUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    const id = Number(
      localStorage.getItem("user_id") ||
        user?.id ||
        user?.user_id ||
        user?.userId ||
        loggedInUser?.id ||
        loggedInUser?.user_id ||
        loggedInUser?.userId ||
        0,
    );

    return Number.isSafeInteger(id) && id > 0 ? id : 0;
  } catch (error) {
    console.error("Get User ID Error:", error);
    return 0;
  }
};

// =====================================
// API RESPONSE HELPER
// =====================================

const getApiItems = (result) => {
  if (Array.isArray(result.cart)) return result.cart;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.items)) return result.items;

  return [];
};

// =====================================
// FORMAT CART ITEM
// =====================================

const formatCartItem = (item) => ({
  ...item,

  id: item.id,

  productId: item.product_id ?? item.productId ?? item.product?.id ?? item.id,

  name: item.name || item.product_name || item.title || "Product",

  image: item.image || item.product_image || item.img || "",

  price: Number(item.price ?? item.unit_price ?? 0),

  quantity: Math.max(1, Number(item.quantity) || 1),
});

// =====================================
// APP LAYOUT
// =====================================

function AppLayout() {
  const location = useLocation();

  const hideHeaderFooter = location.pathname === "/Signup";

  // =====================================
  // STATES
  // =====================================

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersRetry, setOrdersRetry] = useState(0);

  const [products, setProducts] = useState([]);

  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [wishlistRetry, setWishlistRetry] = useState(0);
  const [wishlistOwnerId, setWishlistOwnerId] = useState("");

  const [userId, setUserId] = useState(getLoggedInUserId);

  // =====================================
  // REFS
  // =====================================

  const latestWishlist = useRef([]);

  const cartProcessing = useRef(new Set());

  // =====================================
  // UPDATE USER ID
  // =====================================

  useEffect(() => {
    const updateUser = () => {
      setUserId(getLoggedInUserId());
    };

    updateUser();

    window.addEventListener("authChanged", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, [location.pathname]);

  // =====================================
  // CART API REQUEST HELPER
  // =====================================

  const cartRequest = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Cart API request failed.");
    }

    return result;
  }, []);

  // =====================================
  // FETCH CART
  // =====================================

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      setCartLoading(false);
      setCartError("Please login to view your saved cart.");
      return;
    }

    try {
      setCartLoading(true);
      setCartError("");

      const result = await cartRequest(
        `${CART_API}?user_id=${encodeURIComponent(userId)}`,
      );

      const formattedItems = getApiItems(result).map(formatCartItem);

      setCartItems(formattedItems);
    } catch (error) {
      console.error("Cart Fetch Error:", error);
      setCartError(error.message || "Unable to load cart.");
    } finally {
      setCartLoading(false);
    }
  }, [userId, cartRequest]);

  // =====================================
  // LOAD CART
  // =====================================

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // =====================================
  // ADD PRODUCT TO CART
  // =====================================

  const addToCart = useCallback(
    async (product) => {
      if (!userId) {
        alert("Please login first to add products to your cart.");
        return;
      }

      const productId = Number(
        product.product_id || product.productId || product.id,
      );

      if (!Number.isSafeInteger(productId) || productId <= 0) {
        alert("Product ID is missing. Please check your product data.");
        return;
      }

      const processingKey = `${userId}_${productId}`;

      if (cartProcessing.current.has(processingKey)) {
        return;
      }

      cartProcessing.current.add(processingKey);

      const payload = {
        user_id: userId,
        product_id: productId,

        name:
          product.name || product.product_name || product.title || "Product",

        image: product.image || product.product_image || product.img || "",

        price: Number(product.price || product.unit_price || 0),

        quantity: Math.max(1, Number(product.quantity) || 1),
      };

      try {
        setCartError("");

        await cartRequest(CART_API, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        await fetchCart();

        await createNotification({
          title: "Product Added to Cart",
          message: `${payload.name} has been successfully added to your cart.`,
          type: "cart",
        });

        console.log("Product added to cart successfully.");
      } catch (error) {
        console.error("Add To Cart Error:", error);

        alert(error.message || "Unable to add product to cart.");
      } finally {
        cartProcessing.current.delete(processingKey);
      }
    },
    [userId, cartRequest, fetchCart],
  );

  // =====================================
  // REMOVE PRODUCT FROM CART
  // =====================================

  const removeFromCart = useCallback(
    async (cartRowId) => {
      if (!userId) return;

      try {
        await cartRequest(CART_API, {
          method: "DELETE",
          body: JSON.stringify({
            user_id: Number(userId),
            id: Number(cartRowId),
          }),
        });

        await fetchCart();
      } catch (error) {
        console.error("Remove Cart Error:", error);

        alert(error.message || "Unable to remove product.");
      }
    },
    [userId, cartRequest, fetchCart],
  );

  // =====================================
  // UPDATE CART QUANTITY
  // =====================================

  const updateCartQuantity = useCallback(
    async (cartRowId, quantity) => {
      if (!userId) return;

      const newQuantity = Math.max(1, Number(quantity) || 1);

      try {
        await cartRequest(CART_API, {
          method: "PUT",
          body: JSON.stringify({
            user_id: Number(userId),
            id: Number(cartRowId),
            quantity: newQuantity,
          }),
        });

        await fetchCart();
      } catch (error) {
        console.error("Update Cart Error:", error);

        alert(error.message || "Unable to update quantity.");
      }
    },
    [userId, cartRequest, fetchCart],
  );

  // =====================================
  // CLEAR CART AFTER SUCCESSFUL ORDER
  // =====================================

  const handleOrderSuccess = useCallback(
    async (orderId) => {
      if (!userId) {
        throw new Error("User login information is missing.");
      }

      try {
        // Use the existing DELETE API for each cart row.
        const itemsToDelete = [...cartItems];

        await Promise.all(
          itemsToDelete.map((item) =>
            cartRequest(CART_API, {
              method: "DELETE",
              body: JSON.stringify({
                user_id: Number(userId),
                id: Number(item.id),
              }),
            }),
          ),
        );

        // Update React state immediately.
        setCartItems([]);
        setCartError("");
        setCartLoading(false);

        console.log("Cart cleared after successful order:", orderId);
      } catch (error) {
        console.error("Cart Clear Error:", error);

        await fetchCart();

        throw error;
      }
    },
    [userId, cartItems, cartRequest, fetchCart],
  );

  // =====================================
  // FETCH WISHLIST
  // =====================================

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchWishlist = async () => {
      setWishlistItems([]);
      latestWishlist.current = [];
      setWishlistLoaded(false);
      setWishlistError("");
      setWishlistOwnerId("");

      if (!userId) {
        setWishlistLoaded(true);
        return;
      }

      try {
        const response = await fetch(
          `${WISHLIST_API}?user_id=${encodeURIComponent(userId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Wishlist fetch failed.");
        }

        const formattedItems = (
          Array.isArray(result.data) ? result.data : []
        ).map((item) => ({
          ...item,
          id: Number(item.id),
          price: Number(item.price) || 0,
          inStock:
            item.inStock === true || item.inStock === 1 || item.inStock === "1",
        }));

        if (!active) return;

        latestWishlist.current = formattedItems;
        setWishlistItems(formattedItems);
        setWishlistOwnerId(String(userId));
        setWishlistError("");
      } catch (error) {
        if (error.name !== "AbortError" && active) {
          console.error("Wishlist Fetch Error:", error);

          setWishlistError(error.message || "Unable to load wishlist.");
        }
      } finally {
        if (active) {
          setWishlistLoaded(true);
        }
      }
    };

    fetchWishlist();

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, wishlistRetry]);

  // =====================================
  // FETCH ORDER HISTORY
  // =====================================

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchOrders = async () => {
      setOrders([]);
      setOrdersError("");

      if (!userId) {
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);

        const url = `${ORDERS_API}?user_id=${encodeURIComponent(userId)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const responseText = await response.text();

        let result;

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error("order_history.php did not return valid JSON.");
        }

        if (!response.ok) {
          throw new Error(
            result.message || `Order API HTTP error: ${response.status}`,
          );
        }

        if (result.success !== true) {
          throw new Error(result.message || "Unable to fetch order products.");
        }

        if (!active) return;

        const rows = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.orders)
            ? result.orders
            : [];

        setOrders(rows);
        setOrdersError("");
      } catch (error) {
        if (error.name !== "AbortError" && active) {
          console.error("Order History Fetch Error:", error);

          setOrdersError(error.message || "Unable to load order history.");
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, ordersRetry, location.pathname]);

  // =====================================
  // SAVE WISHLIST
  // =====================================

  useEffect(() => {
    if (!userId || !wishlistLoaded) return;
    if (wishlistOwnerId !== String(userId)) return;
    if (wishlistError) return;

    const controller = new AbortController();

    const saveWishlist = async () => {
      try {
        const response = await fetch(WISHLIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            items: wishlistItems,
          }),
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Wishlist save failed.");
        }

        latestWishlist.current = wishlistItems;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Wishlist Save Error:", error);
        }
      }
    };

    saveWishlist();

    return () => controller.abort();
  }, [wishlistItems, wishlistLoaded, wishlistOwnerId, wishlistError, userId]);

  // =====================================
  // PLACE ORDER
  // =====================================

  const placeOrder = (orderData) => {
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

      products: (orderData.products || []).map((product) => ({
        ...product,
        quantity: Number(product.quantity) || 1,
        price: Number(product.price) || 0,
      })),
    };

    setOrders((previous) => [newOrder, ...previous]);
  };

  // =====================================
  // COMMON PROPS
  // =====================================

  const wishlistProps = {
    wishlistItems,
    onWishlistChange: setWishlistItems,
    wishlistLoaded,
    wishlistError,

    onRetryWishlist: () => {
      setWishlistRetry((previous) => previous + 1);
    },
  };

  const cartProps = {
    onAddToCart: addToCart,
  };

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <>
      <ScrollToTop />

      {!hideHeaderFooter && (
        <Header
          products={[...products, ...immunityProducts]}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              {...cartProps}
              {...wishlistProps}
              onProductsChange={setProducts}
            />
          }
        />

        <Route
          path="/Home"
          element={
            <Home
              {...cartProps}
              {...wishlistProps}
              onProductsChange={setProducts}
            />
          }
        />

        <Route path="/Signup" element={<Signup />} />

        <Route path="/Login" element={<Login />} />

        <Route path="/deals" element={<Deals onAddToCart={addToCart} />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/Blog" element={<Blog />} />

        <Route path="/blog/:id" element={<BlogDetails />} />

        <Route path="/AboutUs" element={<AboutUs />} />

        <Route path="/CardEmp" element={<CardEmp />} />

        <Route
          path="/Category"
          element={<Category {...cartProps} {...wishlistProps} />}
        />

        <Route path="/Notification" element={<Notification />} />

        <Route
          path="/Wishlist"
          element={
            <Wishlist
              {...wishlistProps}
              onAddToCart={addToCart}
              orders={orders}
            />
          }
        />

        <Route
          path="/ViewProduct"
          element={<ViewProduct {...cartProps} {...wishlistProps} />}
        />

        <Route
          path="/ProductCard"
          element={
            <ProductCard
              {...cartProps}
              {...wishlistProps}
              onProductsChange={setProducts}
            />
          }
        />

        <Route
          path="/OrderHistory"
          element={
            <OrderHistory
              orders={orders}
              loading={ordersLoading}
              error={ordersError}
              onRetry={() => setOrdersRetry((previous) => previous + 1)}
            />
          }
        />

        <Route
          path="/Mycard"
          element={
            <MyCard
              cartItems={cartItems}
              cartLoading={cartLoading}
              cartError={cartError}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onRetry={fetchCart}
            />
          }
        />

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

        <Route
          path="/Payment"
          element={
            <Payment
              onPlaceOrder={placeOrder}
              onOrderSuccess={handleOrderSuccess}
            />
          }
        />

        <Route path="/Account" element={<Account />} />

        <Route path="/Footer" element={<Footer />} />

        <Route
          path="/MenuFooter"
          element={
            <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
          }
        />

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

      {!hideHeaderFooter && (
        <>
          <Footer />

          <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
        </>
      )}
    </>
  );
}

// =====================================
// APP
// =====================================

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
