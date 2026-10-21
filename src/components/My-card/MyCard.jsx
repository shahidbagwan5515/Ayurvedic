import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CardEmp from "./CardEmp";
import "./Mycard.css";
import DeleteIcon from "@mui/icons-material/Delete";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";

function MyCard({ cartItems = [], onRemove, onUpdateQuantity }) {
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState(false);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // Total quantity
  const selectedItems = cartItems.reduce((total, product) => {
    return total + (Number(product.quantity) || 1);
  }, 0);

  // Discount and GST
  const validDiscount = Math.min(discount, subtotal);
  const discountedAmount = subtotal - validDiscount;
  const gst = discountedAmount * 0.05;
  const grandTotal = discountedAmount + gst;

  // Currency format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Remove product
  const handleRemove = (product) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this product?",
    );

    if (confirmRemove) {
      onRemove?.(product.id);
    }
  };

  const changeQuantity = (product, amount) => {
    const currentQuantity = Number(product.quantity) || 1;
    const newQuantity = currentQuantity + amount;

    if (newQuantity < 1) return;

    onUpdateQuantity?.(product.id, newQuantity);
  };

  // Apply coupon
  const applyCoupon = () => {
    const code = discountCode.trim().toUpperCase();

    if (code === "AYUR10") {
      setDiscount(subtotal * 0.1);
      setDiscountMessage("10% discount applied successfully!");
      setDiscountError(false);
    } else {
      setDiscount(0);
      setDiscountMessage("Invalid coupon code. Please try again.");
      setDiscountError(true);
    }
  };

  // Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="mycard-empty">
        <CardEmp />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumb */}
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-arrow">›</span>
          <span className="breadcrumb-current">My Cart</span>
        </div>

        {/* Page heading */}
        <div className="cart-heading">
          <div>
            <h1>My Cart</h1>
            <p>Review your products before checkout.</p>
          </div>

          <span className="cart-item-count">
            {selectedItems} {selectedItems === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Main layout */}
        <div className="cart-layout">
          {/* Left side: Products */}
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
                  {/* Product image */}
                  <div className="cart-product-image">
                    <img
                      src={product.image || product.img}
                      alt={product.name || product.title || "Product"}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  </div>

                  {/* Product details */}
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
                      {/* Quantity */}
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => changeQuantity(product, -1)}
                          disabled={Number(product.quantity || 1) <= 1}
                        >
                          −
                        </button>

                        <span>{Number(product.quantity) || 1}</span>

                        <button
                          type="button"
                          onClick={() => changeQuantity(product, 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="cart-product-price">
                        <strong>{formatPrice(price * quantity)}</strong>

                        {quantity > 1 && <span>{formatPrice(price)} each</span>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="cart-continue">
              <Link to="/" className="continue-shopping">
                <span>←</span> Continue Shopping
              </Link>
            </div>
          </section>

          {/* Right side: Summary */}
          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <p className="summary-subtitle">Check your order details below.</p>

            {/* Coupon */}
            <div className="cart-coupon">
              <label htmlFor="couponCode">
                <span aria-hidden="true">🏷</span> Discount Code
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

            {/* Price details */}
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

            {/* Grand total */}
            <div className="cart-grand-total">
              <div>
                <h3>Total Amount</h3>
                <p>Inclusive of applicable taxes</p>
              </div>

              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            {/* Checkout */}
            <Link to="/Checkout" className="cart-checkout-btn">
              Proceed to Checkout
              <span>→</span>
            </Link>

            <div className="cart-secure-note">
              <span aria-hidden="true">🔒</span>
              <span>Secure checkout and safe payments</span>
            </div>

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
