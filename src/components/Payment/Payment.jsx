import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment({ onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const location = useLocation();
  const navigate = useNavigate();

  // Checkout se receive  data

  const {
    products = [],
    subtotal = 0,
    discount = 0,
    deliveryAmount = 0,
    gst = 0,
    grandTotal = 0,
    deliveryAddress = null,
    billingAddress = null,
  } = location.state || {};

  // Price format
  const formatPrice = (price) =>
    `₹${(Number(price) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Payment options
  const paymentOptions = [
    {
      id: "upi",
      icon: "📱",
      title: "UPI Payment",
      description: "Google Pay, PhonePe, Paytm, BHIM",
    },
    {
      id: "card",
      icon: "💳",
      title: "Credit / Debit Card",
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "netbanking",
      icon: "🏦",
      title: "Net Banking",
      description: "All major banks supported",
    },
    {
      id: "cod",
      icon: "💵",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
    },
  ];

  // Confirm payment

  const handlePayment = (e) => {
    e.preventDefault();

    if (!products.length) {
      alert("Your cart is empty. Please add products first.");
      navigate("/Checkout");
      return;
    }

    if (!deliveryAddress || !billingAddress) {
      alert("Please select delivery and billing addresses.");
      navigate("/Checkout");
      return;
    }

    if (typeof onPlaceOrder !== "function") {
      alert("Order functionality is not connected. Check App.jsx.");
      return;
    }

    const selectedPayment =
      paymentMethod === "upi"
        ? "UPI"
        : paymentMethod === "card"
          ? "Credit / Debit Card"
          : paymentMethod === "netbanking"
            ? "Net Banking"
            : "Cash on Delivery";

    // Demo order: no real payment is processed
    onPlaceOrder({
      products,
      total: Number(grandTotal) || 0,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      deliveryAmount: Number(deliveryAmount) || 0,
      gst: Number(gst) || 0,
      deliveryAddress,
      billingAddress,
      paymentMethod: selectedPayment,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Demo",
    });

    alert(`Order Placed Successfully`);

    navigate("/OrderHistory", { replace: true });
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Breadcrumb */}
        <div className="payment-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/Checkout">Checkout</Link>
          <span>/</span>
          <span className="current">Payment</span>
        </div>

        {/* Heading */}
        <div className="payment-heading">
          <div>
            <span className="payment-eyebrow">SECURE CHECKOUT</span>
            <h1>Complete Your Payment</h1>
            <p>Choose your preferred payment method to continue.</p>
          </div>

          <div className="payment-security">
            <span className="security-icon">🔒</span>
            <div>
              <strong>Secure Payment</strong>
              <small>Your payment details stay protected</small>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-layout">
          {/* Left: Payment methods */}
          <section className="payment-card">
            <div className="payment-section-heading">
              <div className="payment-step">01</div>
              <div>
                <h2>Payment Method</h2>
                <p>Select how you would like to pay.</p>
              </div>
            </div>

            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`payment-option ${
                    paymentMethod === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />

                  <span className="payment-option-icon">{option.icon}</span>

                  <span className="payment-option-info">
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>

                  <span className="payment-radio">
                    {paymentMethod === option.id && (
                      <span className="payment-radio-dot" />
                    )}
                  </span>
                </label>
              ))}
            </div>

            {/* UPI */}
            {paymentMethod === "upi" && (
              <div className="payment-extra">
                <label htmlFor="upiId">UPI ID (optional)</label>
                <input id="upiId" type="text" placeholder="example@upi" />
                <p>
                  UPI payments require an integrated payment gateway to process
                  and verify payments.
                </p>
              </div>
            )}

            {/* Card */}
            {paymentMethod === "card" && (
              <div className="payment-extra">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter card number"
                  autoComplete="off"
                />

                <div className="payment-input-row">
                  <div>
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="CVV"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <p>Demo form only. Do not enter real card details here.</p>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === "netbanking" && (
              <div className="payment-extra">
                <label htmlFor="bank">Choose your bank</label>
                <select id="bank" defaultValue="">
                  <option value="" disabled>
                    Select bank
                  </option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Axis">Axis Bank</option>
                  <option value="Other">Other Bank</option>
                </select>
              </div>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === "cod" && (
              <div className="payment-cod-note">
                <span>✓</span>
                <p>Pay when your order is delivered to your address.</p>
              </div>
            )}

            {/* Trust information */}
            <div className="payment-trust">
              <span>🔐 Secure checkout</span>
              <span>✓ Safe shopping</span>
              <span> Customer support</span>
            </div>
          </section>

          {/* Right: Order summary */}
          <aside className="payment-summary">
            <h2>Order Summary</h2>
            <p className="summary-subtitle">
              Review your order before continuing.
            </p>

            {/* Actual cart products */}
            <div className="summary-products">
              {products.length > 0 ? (
                products.map((product, index) => {
                  const quantity = Number(product.quantity) || 1;
                  const price = Number(product.price) || 0;
                  const image = product.image || product.img;
                  const name = product.name || product.title || "Product";

                  return (
                    <div className="summary-product" key={product.id ?? index}>
                      <div className="summary-product-icon">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          "🌿"
                        )}
                      </div>

                      <div className="summary-product-info">
                        <strong>{name}</strong>
                        <span>Qty: {quantity}</span>
                        <span>{formatPrice(price * quantity)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No products found. Please return to checkout.</p>
              )}
            </div>

            <div className="summary-divider" />

            {/* Price breakdown */}
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <strong>-{formatPrice(discount)}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong
                className={Number(deliveryAmount) === 0 ? "free-delivery" : ""}
              >
                {Number(deliveryAmount) === 0
                  ? "FREE"
                  : formatPrice(deliveryAmount)}
              </strong>
            </div>

            <div className="summary-row">
              <span>GST</span>
              <strong>{formatPrice(gst)}</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total Payable</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="payment-submit-btn"
              disabled={!products.length}
            >
              {paymentMethod === "cod"
                ? "Confirm Cash on Delivery"
                : "Continue to Pay"}
              <span>→</span>
            </button>

            <Link to="/Checkout" className="back-checkout-link">
              ← Back to Checkout
            </Link>

            {/* Help */}
            <div className="payment-help">
              <span>💬</span>
              <div>
                <strong>Need help?</strong>
                <p>Contact our support team for payment assistance.</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Payment;
