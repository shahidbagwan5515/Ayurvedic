import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import Login from "../Login/Login";
import OrderHistory from "./OrderHistory/OrderHistory";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  "https://plyexpert.com/shaheedApis/Backend-web/api/wishlist.php";

// ==========================================
// GUEST TOKEN
// ==========================================

const getGuestToken = () => {
  let token = localStorage.getItem("guest_token");

  if (!token) {
    token =
      "guest_" +
      (window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Date.now() + "_" + Math.random().toString(36).slice(2));

    localStorage.setItem("guest_token", token);
  }

  return token;
};

// ==========================================
// WISHLIST COMPONENT
// ==========================================

function Wishlist({
  wishlistItems = [],
  onWishlistChange,
  onAddToCart,
  orders = [],
}) {
  const [activeTab, setActiveTab] = useState("Wishlist");

  const [cartMessage, setCartMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);

  const [guestToken] = useState(getGuestToken);

  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [wishlistReady, setWishlistReady] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // ==========================================
  // FETCH WISHLIST FROM DATABASE
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      try {
        setLoadError("");

        const response = await fetch(
          `${API_URL}?guest_token=${encodeURIComponent(guestToken)}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to fetch wishlist.");
        }

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid wishlist response.");
        }

        if (isMounted) {
          onWishlistChange(result.data);

          // Database saving starts after successful fetching.
          setWishlistReady(true);
        }
      } catch (error) {
        console.error("Wishlist Fetch Error:", error);

        if (isMounted) {
          setLoadError(error.message || "Wishlist loading failed.");
          setWishlistReady(false);
        }
      } finally {
        if (isMounted) {
          setWishlistLoaded(true);
        }
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, [guestToken, retryCount, onWishlistChange]);

  // ==========================================
  // SAVE WISHLIST TO DATABASE
  // ==========================================

  useEffect(() => {
    if (!wishlistReady) return;

    const controller = new AbortController();

    const saveWishlist = async () => {
      try {
        const response = await fetch(
          `${API_URL}?guest_token=${encodeURIComponent(guestToken)}`,
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
          throw new Error(result.message || "Unable to save wishlist.");
        }

        console.log("Wishlist saved successfully:", result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Wishlist Save Error:", error);
        }
      }
    };

    saveWishlist();

    return () => {
      controller.abort();
    };
  }, [wishlistItems, wishlistReady, guestToken]);

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  const showMessage = (message) => {
    setCartMessage(message);
    setSnackbarOpen(true);
  };

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeFromWishlist = (id) => {
    if (typeof onWishlistChange !== "function") return;

    onWishlistChange((previous) =>
      previous.filter((item) => String(item.id) !== String(id)),
    );

    showMessage("Product removed from wishlist.");
  };

  // ==========================================
  // MOVE PRODUCT TO CART
  // ==========================================

  const moveToCart = (product) => {
    if (!product.inStock) {
      showMessage("This product is out of stock.");
      return;
    }

    if (typeof onAddToCart !== "function") {
      showMessage("Cart functionality is not connected.");
      return;
    }

    onAddToCart({
      ...product,
      quantity: 1,
      selectedSize: product.sizes?.[0] || "",
    });

    onWishlistChange((previous) =>
      previous.filter((item) => String(item.id) !== String(product.id)),
    );

    showMessage(`${product.name} moved to cart successfully!`);
  };

  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menuItems = [
    { name: "My Account", icon: "user" },
    { name: "Orders History", icon: "box" },
    { name: "Wishlist", icon: "heart" },
    { name: "Address Book", icon: "book" },
  ];

  // ==========================================
  // RETRY WISHLIST
  // ==========================================

  const retryWishlist = () => {
    setWishlistLoaded(false);
    setWishlistReady(false);
    setLoadError("");

    setRetryCount((previous) => previous + 1);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="account-page">
      {/* BREADCRUMB */}

      <div className="account-breadcrumb">
        <Link to="/">Home</Link>

        <span className="breadcrumb-chevron">›</span>

        <span>{activeTab}</span>
      </div>

      <div className="account-layout">
        {/* SIDEBAR */}

        <aside className="account-sidebar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`account-menu-item ${
                activeTab === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(item.name);
                setCartMessage("");
                setSnackbarOpen(false);
              }}
              aria-current={activeTab === item.name ? "page" : undefined}
            >
              <span className="account-menu-icon">
                {item.icon === "user" && <PersonOutlinedIcon />}

                {item.icon === "box" && <ShoppingBagOutlinedIcon />}

                {item.icon === "heart" && <FavoriteBorderOutlinedIcon />}

                {item.icon === "book" && <ImportContactsOutlinedIcon />}
              </span>

              <span>{item.name}</span>

              <span className="menu-arrow">›</span>
            </button>
          ))}

          {/* LOGOUT */}

          <button
            type="button"
            className="account-menu-item logout-menu"
            onClick={() => setLoginOpen(true)}
          >
            <LogoutOutlinedIcon />

            <span>Logout</span>

            <span className="menu-arrow">›</span>
          </button>
        </aside>

        {/* MAIN CONTENT */}

        <main className="wishlist-content" key={activeTab}>
          <h1>{activeTab}</h1>

          {/* MY ACCOUNT */}

          {activeTab === "My Account" && (
            <div className="account-tab-body">
              <div className="account-welcome-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />

                  <path d="M4.5 21c0-4.5 3-7 7.5-7s7.5 2.5 7.5 7" />
                </svg>
              </div>

              <h2>Welcome to My Account</h2>

              <p>Manage your profile and account details here.</p>
            </div>
          )}

          {/* ORDER HISTORY */}

          {activeTab === "Orders History" && <OrderHistory orders={orders} />}

          {/* ADDRESS BOOK */}

          {activeTab === "Address Book" && (
            <div className="account-tab-body">
              <div className="account-empty-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>

              <h2>No saved addresses</h2>

              <p>Your saved delivery addresses will appear here.</p>
            </div>
          )}

          {/* WISHLIST */}

          {activeTab === "Wishlist" && (
            <>
              {/* LOADING */}

              {!wishlistLoaded && (
                <div className="account-tab-body">
                  <h2>Loading wishlist...</h2>

                  <p>Please wait while we fetch your saved products.</p>
                </div>
              )}

              {/* ERROR */}

              {wishlistLoaded && loadError && (
                <div className="account-tab-body">
                  <h2>Unable to load wishlist</h2>

                  <p>{loadError}</p>

                  <button
                    type="button"
                    className="wishlist-shop-btn"
                    onClick={retryWishlist}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* EMPTY WISHLIST */}

              {wishlistLoaded && !loadError && wishlistItems.length === 0 && (
                <div className="account-tab-body">
                  <div className="account-empty-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                  </div>

                  <h2>Your wishlist is empty</h2>

                  <p>Save your favourite products here to find them easily.</p>

                  <Link to="/" className="wishlist-shop-btn">
                    Continue Shopping
                  </Link>
                </div>
              )}

              {/* WISHLIST PRODUCTS */}

              {wishlistLoaded && !loadError && wishlistItems.length > 0 && (
                <div className="wishlist-list">
                  {wishlistItems.map((product) => (
                    <article className="wishlist-product" key={product.id}>
                      {/* PRODUCT IMAGE */}

                      <div className="wishlist-product-image">
                        <img
                          src={product.image}
                          alt={product.name || "Wishlist product"}
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="wishlist-product-details">
                        <h2>{product.name}</h2>

                        <div className="wishlist-product-meta">
                          <span
                            className={
                              product.inStock
                                ? "wishlist-stock"
                                : "wishlist-out-stock"
                            }
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>

                          <span>SKU: {product.sku || "N/A"}</span>
                        </div>

                        <p className="wishlist-price">
                          ₹{Number(product.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="wishlist-product-actions">
                        <button
                          type="button"
                          className="wishlist-heart-btn"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                          title="Remove from wishlist"
                        >
                          ×
                        </button>

                        <button
                          type="button"
                          className="wishlist-cart-btn"
                          disabled={!product.inStock}
                          onClick={() => moveToCart(product)}
                        >
                          Move to Cart
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;

          setSnackbarOpen(false);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          content: {
            sx: {
              backgroundColor: "#176b45",
              color: "white",
            },
          },
        }}
        message={cartMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            aria-label="Close notification"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      {/* LOGIN MODAL */}

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

export default Wishlist;
