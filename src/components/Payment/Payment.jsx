import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import { createNotification } from "../../utils/notificationService";

const PAYMENT_API =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend/api/payment.php";

// =====================================
// GET LOGGED IN USER ID
// =====================================

const getLoggedInUserId = () => {
  const directId = localStorage.getItem("user_id");

  if (directId && Number(directId) > 0) {
    return Number(directId);
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return Number(user.id || user.user_id || user.userId || user.userID || 0);
  } catch {
    return 0;
  }
};

function Payment({ onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // =====================================
  // CHECKOUT DATA
  // =====================================

  const {
    orderId,
    orderNumber,
    products = [],
    subtotal = 0,
    discount = 0,
    deliveryAmount = 0,
    gst = 0,
    grandTotal = 0,
    deliveryAddress = null,
    billingAddress = null,
  } = location.state || {};

  // =====================================
  // NOTIFICATION HELPER
  // =====================================

  const sendNotification = async (title, message, type = "order") => {
    try {
      await createNotification({
        title,
        message,
        type,
      });
    } catch (error) {
      console.error("Payment Notification Error:", error);
    }
  };

  // =====================================
  // PRICE FORMAT
  // =====================================

  const formatPrice = (price) =>
    `₹${(Number(price) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // =====================================
  // PAYMENT OPTIONS
  // =====================================

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

  // =====================================
  // CONFIRM PAYMENT
  // =====================================

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!orderId) {
      alert("Order ID missing. Please checkout again.");
      navigate("/Checkout");
      return;
    }

    if (!products.length) {
      alert("Your cart is empty.");
      navigate("/Checkout");
      return;
    }

    const userId = getLoggedInUserId();

    if (!userId) {
      alert("Please login first.");
      navigate("/Login");
      return;
    }

    if (isPaying) return;

    try {
      setIsPaying(true);

      const response = await fetch(PAYMENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: Number(orderId),
          user_id: userId,
          payment_method: paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Payment request failed.");
      }

      // =====================================
      // CASH ON DELIVERY
      // =====================================

      if (paymentMethod === "cod") {
        const confirmedOrder = {
          orderId: result.order_id,
          orderNumber: result.order_number || orderNumber,
          paymentMethod: "Cash on Delivery",
        };

        setSuccessOrder(confirmedOrder);

        await sendNotification(
          "Order Confirmed Successfully",
          `Your order ${confirmedOrder.orderNumber} has been confirmed with Cash on Delivery. Order total: ${formatPrice(grandTotal)}.`,
          "order",
        );

        setShowSuccess(true);
        return;
      }

      // =====================================
      // ONLINE PAYMENT
      // =====================================

      await sendNotification(
        "Online Payment Pending",
        `Your ${paymentMethod.toUpperCase()} payment method has been selected for order ${result.order_number || orderNumber}. Complete payment after payment gateway integration.`,
        "order",
      );

      alert(
        "Online payment gateway is not integrated yet. Your order payment status is Pending.",
      );
    } catch (error) {
      console.error("Payment API Error:", error);

      alert(error.message || "Unable to connect to payment server.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* BREADCRUMB */}

        <div className="payment-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/Checkout">Checkout</Link>
          <span>/</span>
          <span className="current">Payment</span>
        </div>

        {/* HEADING */}

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
          {/* LEFT: PAYMENT METHODS */}

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

            {/* CARD */}

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

            {/* NET BANKING */}

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

            {/* CASH ON DELIVERY */}

            {paymentMethod === "cod" && (
              <div className="payment-cod-note">
                <span>✓</span>
                <p>Pay when your order is delivered to your address.</p>
              </div>
            )}

            {/* TRUST INFORMATION */}

            <div className="payment-trust">
              <span>🔐 Secure checkout</span>
              <span>✓ Safe shopping</span>
              <span>Customer support</span>
            </div>
          </section>

          {/* RIGHT: ORDER SUMMARY */}

          <aside className="payment-summary">
            <h2>Order Summary</h2>

            <p className="summary-subtitle">
              Review your order before continuing.
            </p>

            {/* CART PRODUCTS */}

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

            {/* PRICE BREAKDOWN */}

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

            {/* GRAND TOTAL */}

            <div className="summary-total">
              <span>Total Payable</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="payment-submit-btn"
              disabled={!products.length || isPaying}
            >
              {isPaying
                ? "Please wait..."
                : paymentMethod === "cod"
                  ? "Confirm Cash on Delivery"
                  : "Continue to Pay"}

              <span>→</span>
            </button>

            <Link to="/Checkout" className="back-checkout-link">
              ← Back to Checkout
            </Link>

            {/* HELP */}

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

      {/* =====================================
          ORDER SUCCESS MODAL
      ===================================== */}

      {showSuccess && (
        <div className="payment-success-overlay">
          <div className="payment-success-modal">
            <div className="success-icon">✓</div>

            <span className="success-label">ORDER CONFIRMED</span>

            <h2>Thank You for Your Order!</h2>

            <p>
              Your order has been successfully placed. We will notify you when
              your order is ready.
            </p>

            <div className="success-order-details">
              <span>Order Number</span>
              <strong>{successOrder?.orderNumber}</strong>

              <span>Payment Method</span>
              <strong>{successOrder?.paymentMethod}</strong>

              <span>Order Total</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            <button
              className="success-continue-btn"
              onClick={() => {
                navigate("/OrderHistory", { replace: true });
              }}
            >
              View My Orders →
            </button>

            <p className="success-footer">Thank you for shopping with us 🌿</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
