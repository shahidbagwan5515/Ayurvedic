import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CardEmp from "./CardEmp";
import "./Mycard.css";

import DeleteIcon from "@mui/icons-material/Delete";
import { createNotification } from "../../utils/notificationService";

function MyCard({
  cartItems = [],
  cartLoading = false,
  cartError = "",
  onRemove,
  onUpdateQuantity,
  onRetry,
}) {
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState(false);

  // =====================================
  // NOTIFICATION HELPER
  // =====================================

  const sendNotification = async (title, message, type = "cart") => {
    try {
      await createNotification({
        title,
        message,
        type,
      });
    } catch (error) {
      console.error("Cart Notification Error:", error);
    }
  };

  // =====================================
  // CALCULATE SUBTOTAL
  // =====================================

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // =====================================
  // TOTAL QUANTITY
  // =====================================

  const selectedItems = useMemo(() => {
    return cartItems.reduce((total, product) => {
      return total + (Number(product.quantity) || 1);
    }, 0);
  }, [cartItems]);

  // =====================================
  // DISCOUNT AND GST
  // =====================================

  const validDiscount = Math.min(discount, subtotal);
  const discountedAmount = subtotal - validDiscount;
  const gst = discountedAmount * 0.05;
  const grandTotal = discountedAmount + gst;

  // =====================================
  // CURRENCY FORMAT
  // =====================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  // =====================================
  // REMOVE PRODUCT + NOTIFICATION
  // =====================================

  const handleRemove = async (product) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this product?",
    );

    if (!confirmRemove) return;

    try {
      if (typeof onRemove !== "function") {
        throw new Error("Remove function is not available.");
      }

      await onRemove(product.id);

      await sendNotification(
        "Product Removed from Cart",
        `${product.name || product.title || "Product"} has been removed from your cart.`,
        "cart",
      );
    } catch (error) {
      console.error("Remove Cart Error:", error);
    }
  };

  // =====================================
  // UPDATE QUANTITY + NOTIFICATION
  // =====================================

  const changeQuantity = async (product, amount) => {
    const currentQuantity = Number(product.quantity) || 1;
    const newQuantity = currentQuantity + amount;

    if (newQuantity < 1) return;

    try {
      if (typeof onUpdateQuantity !== "function") {
        throw new Error("Quantity update function is not available.");
      }

      await onUpdateQuantity(product.id, newQuantity);

      await sendNotification(
        "Cart Quantity Updated",
        `${product.name || product.title || "Product"} quantity updated to ${newQuantity}.`,
        "cart",
      );
    } catch (error) {
      console.error("Quantity Update Error:", error);
    }
  };

  // =====================================
  // APPLY COUPON + NOTIFICATION
  // =====================================

  const applyCoupon = async () => {
    const code = discountCode.trim().toUpperCase();

    if (code === "AYUR10") {
      setDiscount(subtotal * 0.1);
      setDiscountMessage("10% discount applied successfully!");
      setDiscountError(false);

      await sendNotification(
        "Coupon Applied Successfully",
        "AYUR10 coupon applied. You received 10% discount on your order.",
        "cart",
      );
    } else {
      setDiscount(0);
      setDiscountMessage("Invalid coupon code. Please try again.");
      setDiscountError(true);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (cartLoading) {
    return (
      <div className="mycard-empty">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #25834b",
              borderRadius: "50%",
              margin: "0 auto 18px",
              animation: "cartSpin 0.8s linear infinite",
            }}
          />

          <h3>Loading your cart...</h3>
          <p>Please wait while we fetch your products.</p>
        </div>

        <style>
          {`
            @keyframes cartSpin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // =====================================
  // API ERROR
  // =====================================

  if (cartError) {
    return (
      <div className="mycard-empty">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Unable to load cart</h2>

          <p>{cartError}</p>

          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: "12px 24px",
              background: "#25834b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // EMPTY CART
  // =====================================

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="mycard-empty">
        <CardEmp />
      </div>
    );
  }

  // =====================================
  // MAIN CART UI
  // =====================================

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* BREADCRUMB */}

        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-arrow">›</span>
          <span className="breadcrumb-current">My Cart</span>
        </div>

        {/* PAGE HEADING */}

        <div className="cart-heading">
          <div>
            <h1>My Cart</h1>
            <p>Review your products before checkout.</p>
          </div>

          <span className="cart-item-count">
            {selectedItems} {selectedItems === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* MAIN LAYOUT */}

        <div className="cart-layout">
          {/* LEFT SIDE: PRODUCTS */}

          <section className="cart-products-panel">
            <div className="cart-panel-heading">
              <h2>Your Products</h2>
              <span>{cartItems.length} products</span>
            </div>

            {cartItems.map((product) => {
              const quantity = Number(product.quantity) || 1;
              const price = Number(product.price) || 0;

              return (
                <article className="cart-product" key={product.id}>
                  {/* PRODUCT IMAGE */}

                  <div className="cart-product-image">
                    <img
                      src={product.image || product.img}
                      alt={product.name || product.title || "Product"}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="cart-product-info">
                    <div className="cart-product-top">
                      <div>
                        <h3>{product.name || product.title || "Product"}</h3>

                        {product.category && (
                          <p className="cart-product-category">
                            {product.category}
                          </p>
                        )}
                      </div>

                      {/* DELETE BUTTON */}

                      <button
                        type="button"
                        className="cart-delete-btn"
                        onClick={() => handleRemove(product)}
                        aria-label="Remove product"
                        title="Remove product"
                      >
                        <span aria-hidden="true">
                          <DeleteIcon />
                        </span>
                      </button>
                    </div>

                    {product.description && (
                      <p className="cart-product-description">
                        {product.description}
                      </p>
                    )}

                    {product.size && (
                      <p className="cart-product-meta">
                        Size: <strong>{product.size}</strong>
                      </p>
                    )}

                    {product.stock && (
                      <p className="cart-stock">
                        <span className="stock-dot"></span>
                        {product.stock}
                      </p>
                    )}

                    <div className="cart-product-bottom">
                      {/* QUANTITY */}

                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => changeQuantity(product, -1)}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() => changeQuantity(product, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* PRICE */}

                      <div className="cart-product-price">
                        <strong>{formatPrice(price * quantity)}</strong>

                        {quantity > 1 && <span>{formatPrice(price)} each</span>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* CONTINUE SHOPPING */}

            <div className="cart-continue">
              <Link to="/" className="continue-shopping">
                <span>←</span> Continue Shopping
              </Link>
            </div>
          </section>

          {/* RIGHT SIDE: ORDER SUMMARY */}

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <p className="summary-subtitle">Check your order details below.</p>

            {/* COUPON */}

            <div className="cart-coupon">
              <label htmlFor="couponCode">
                <span aria-hidden="true">🏷</span>
                Discount Code
              </label>

              <div className="cart-coupon-input">
                <input
                  id="couponCode"
                  type="text"
                  placeholder="Enter coupon code"
                  value={discountCode}
                  onChange={(event) => {
                    setDiscountCode(event.target.value);
                    setDiscountMessage("");
                  }}
                />

                <button type="button" onClick={applyCoupon}>
                  Apply
                </button>
              </div>

              {discountMessage && (
                <p
                  className={
                    discountError
                      ? "coupon-message coupon-error"
                      : "coupon-message coupon-success"
                  }
                >
                  {discountMessage}
                </p>
              )}

              <p className="coupon-hint">
                Try code <strong>AYUR10</strong> for 10% off.
              </p>
            </div>

            <div className="summary-divider"></div>

            {/* PRICE DETAILS */}

            <div className="cart-price-rows">
              <div>
                <span>Subtotal ({selectedItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {validDiscount > 0 && (
                <div className="discount-row">
                  <span>Discount</span>
                  <span>- {formatPrice(validDiscount)}</span>
                </div>
              )}

              <div>
                <span>Delivery</span>
                <span className="free-delivery">Free</span>
              </div>

              <div>
                <span>GST (5%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            {/* GRAND TOTAL */}

            <div className="cart-grand-total">
              <div>
                <h3>Total Amount</h3>
                <p>Inclusive of applicable taxes</p>
              </div>

              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            {/* CHECKOUT */}

            <Link to="/Checkout" className="cart-checkout-btn">
              Proceed to Checkout
              <span>→</span>
            </Link>

            {/* SECURE CHECKOUT */}

            <div className="cart-secure-note">
              <span aria-hidden="true">🔒</span>
              <span>Secure checkout and safe payments</span>
            </div>

            {/* SHIPPING */}

            <div className="cart-shipping-note">
              <span className="shipping-icon" aria-hidden="true">
                🚚
              </span>

              <div>
                <strong>Free Shipping</strong>
                <p>Enjoy free delivery on your order.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default MyCard;
