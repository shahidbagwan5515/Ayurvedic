import React from "react";
import { useState } from "react";
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

function Wishlist({ wishlistItems = [], onWishlistChange, onAddToCart }) {
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [cartMessage, setCartMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [loginOpen, setLoginOpen] = React.useState(false);

  // Remove product from shared wishlist state.
  const removeFromWishlist = (id) => {
    onWishlistChange((previous) => previous.filter((item) => item.id !== id));

    setCartMessage("Product removed from wishlist.");
    setSnackbarOpen(true);
  };

  // Move product to cart, then remove it from wishlist.
  const moveToCart = (product) => {
    if (!product.inStock) {
      setCartMessage("This product is out of stock.");
      setSnackbarOpen(true);
      return;
    }

    if (typeof onAddToCart !== "function") {
      setCartMessage("Cart functionality is not connected.");
      setSnackbarOpen(true);
      return;
    }

    onAddToCart({
      ...product,
      quantity: 1,
      selectedSize: product.sizes?.[0] || "",
    });

    onWishlistChange((previous) =>
      previous.filter((item) => item.id !== product.id),
    );

    setCartMessage(`${product.name} moved to cart successfully!`);
    setSnackbarOpen(true);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const menuItems = [
    { name: "My Account", icon: "user" },
    { name: "My Orders", icon: "box" },
    { name: "Wishlist", icon: "heart" },
    { name: "Address Book", icon: "book" },
  ];

  return (
    <div className="account-page">
      <div className="account-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-chevron">›</span>
        <span>{activeTab}</span>
      </div>

      <div className="account-layout">
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

        <main className="wishlist-content" key={activeTab}>
          <h1>{activeTab}</h1>

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

          {activeTab === "My Orders" && (
            <div className="account-tab-body">
              <div className="account-empty-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 2 9 5-9 5-9-5 9-5Z" />
                  <path d="M3 7v10l9 5 9-5V7" />
                  <path d="M12 12v10" />
                </svg>
              </div>

              <h2>No orders found</h2>
              <p>
                You haven't placed any orders yet. Your order history will
                appear here once you make a purchase.
              </p>

              <Link to="/" className="wishlist-shop-btn">
                Start Shopping
              </Link>
            </div>
          )}

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

          {activeTab === "Wishlist" && (
            <>
              {wishlistItems.length === 0 ? (
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
              ) : (
                <div className="wishlist-list">
                  {wishlistItems.map((product) => (
                    <article className="wishlist-product" key={product.id}>
                      <div className="wishlist-product-image">
                        <img
                          src={product.image}
                          alt={product.name || "Wishlist product"}
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      </div>

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

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

export default Wishlist;
