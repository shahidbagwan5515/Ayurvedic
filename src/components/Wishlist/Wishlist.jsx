import React, { useRef, useState } from "react";
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
import { createNotification } from "../../utils/notificationService";
import Account from "./Account/Account";

function Wishlist({
  wishlistItems = [],
  onWishlistChange,
  onAddToCart,
  orders = [],
  wishlistLoaded = true,
  wishlistError = "",
  onRetryWishlist,
}) {
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [cartMessage, setCartMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Prevent rapid duplicate clicks on the same product.
  const processingProducts = useRef(new Set());

  const showMessage = (message) => {
    setCartMessage(message);
    setSnackbarOpen(true);
  };

  // ==========================================
  // REMOVE PRODUCT FROM WISHLIST
  // ==========================================
  const removeFromWishlist = async (product) => {
    const productId = String(product.id);

    if (processingProducts.current.has(productId)) return;

    if (typeof onWishlistChange !== "function") {
      showMessage("Wishlist is not connected.");
      return;
    }

    processingProducts.current.add(productId);

    try {
      // Update the UI. App.jsx saves the updated wishlist for this user.
      onWishlistChange((previous) =>
        previous.filter((item) => String(item.id) !== productId),
      );

      // createNotification expects an object: { title, message, type }.
      await createNotification({
        title: "Product Removed from Wishlist",
        message: `${product.name} has been removed from your wishlist.`,
        type: "wishlist",
      });

      showMessage(`${product.name} removed from wishlist successfully!`);
    } catch (error) {
      console.error("Remove wishlist notification error:", error);
      showMessage(`${product.name} removed from wishlist.`);
    } finally {
      processingProducts.current.delete(productId);
    }
  };

  // ==========================================
  // MOVE PRODUCT TO CART
  // ==========================================
  const moveToCart = async (product) => {
    const productId = String(product.id);

    if (processingProducts.current.has(productId)) return;

    if (!product.inStock || Number(product.stock) <= 0) {
      showMessage("This product is out of stock.");
      return;
    }

    if (typeof onAddToCart !== "function") {
      showMessage("Cart functionality is not connected.");
      return;
    }

    processingProducts.current.add(productId);

    try {
      // App.jsx handles cart API saving and creates the cart notification.
      // Await it so the wishlist item is removed only after cart succeeds.
      await onAddToCart({
        ...product,
        quantity: 1,
        selectedSize: product.sizes?.[0] || "",
      });

      if (typeof onWishlistChange === "function") {
        onWishlistChange((previous) =>
          previous.filter((item) => String(item.id) !== productId),
        );
      }

      // Do not call createNotification here:
      // App.jsx addToCart() already sends the cart notification.
      showMessage(`${product.name} moved to cart successfully!`);
    } catch (error) {
      console.error("Move to cart error:", error);
      showMessage("Unable to move this product to cart. Please try again.");
    } finally {
      processingProducts.current.delete(productId);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Clear the current customer's login data.
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");

    // Notify App.jsx so it reloads/clears user-specific wishlist data.
    window.dispatchEvent(new Event("authChanged"));

    // Clear the visible wishlist immediately.
    if (typeof onWishlistChange === "function") {
      onWishlistChange([]);
    }

    setActiveTab("Wishlist");
    showMessage("You have been logged out successfully.");

    // Open the login modal after logout.
    setLoginOpen(true);
  };

  const menuItems = [
    { name: "My Account", icon: "user" },
    { name: "Orders History", icon: "box" },
    { name: "Wishlist", icon: "heart" },
    { name: "Address Book", icon: "book" },
  ];

  const retryWishlist = () => {
    if (typeof onRetryWishlist === "function") {
      onRetryWishlist();
    }
  };

  return (
    <div className="account-page">
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
            onClick={handleLogout}
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
          {activeTab === "My Account" && <Account />}

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
              {!wishlistLoaded && (
                <div className="account-tab-body">
                  <h2>Loading wishlist...</h2>
                  <p>Please wait while we fetch your saved products.</p>
                </div>
              )}

              {wishlistLoaded && wishlistError && (
                <div className="account-tab-body">
                  <h2>Unable to load wishlist</h2>
                  <p>{wishlistError}</p>
                  <button
                    type="button"
                    className="wishlist-shop-btn"
                    onClick={retryWishlist}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {wishlistLoaded &&
                !wishlistError &&
                wishlistItems.length === 0 && (
                  <div className="account-tab-body">
                    <div className="account-empty-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />
                      </svg>
                    </div>
                    <h2>Your wishlist is empty</h2>
                    <p>
                      Save your favourite products here to find them easily.
                    </p>
                    <Link to="/" className="wishlist-shop-btn">
                      Continue Shopping
                    </Link>
                  </div>
                )}

              {wishlistLoaded && !wishlistError && wishlistItems.length > 0 && (
                <div className="wishlist-list">
                  {wishlistItems.map((product) => (
                    <article
                      className="wishlist-product"
                      key={product.wishlistId || product.id}
                    >
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
                          onClick={() => removeFromWishlist(product)}
                          aria-label="Remove from wishlist"
                          title="Remove from wishlist"
                          disabled={processingProducts.current.has(
                            String(product.id),
                          )}
                        >
                          ×
                        </button>

                        <button
                          type="button"
                          className="wishlist-cart-btn"
                          disabled={
                            !product.inStock || Number(product.stock) <= 0
                          }
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
              borderRadius: "10px",
              fontWeight: 500,
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
