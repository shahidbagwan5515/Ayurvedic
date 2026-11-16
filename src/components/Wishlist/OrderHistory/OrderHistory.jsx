import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./OrderHistory.css";

function OrderHistory({ orders = [], loading = false, error = "", onRetry }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  if (loading) {
    return (
      <section className="order-history">
        <div className="order-empty">
          <h2>Loading your orders...</h2>
          <p>Please wait while we fetch your order history.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="order-history">
        <div className="order-empty">
          <h2>Unable to load orders</h2>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="order-history">
      <div className="order-history-header">
        <p>Track, manage and view your recent orders.</p>
        <Link to="/" className="order-shop-btn">
          Continue Shopping
        </Link>
      </div>

      <div className="order-list-heading">
        <span>{orders.length} orders</span>
      </div>

      <div className="order-history-list">
        {orders.map((order) => {
          const orderKey = order.id;
          const isExpanded = selectedOrder === orderKey;
          const products = Array.isArray(order.products) ? order.products : [];

          return (
            <article className="order-history-card" key={orderKey}>
              <div className="order-card-top">
                <div>
                  <span className="order-muted">Order ID</span>
                  <h3>{order.orderNumber || order.id}</h3>
                </div>

                <span className="order-status status-processing">
                  <span className="status-dot" />
                  {order.status || "Processing"}
                </span>
              </div>

              <div className="order-card-info">
                <div>
                  <span className="order-muted">Order Date</span>
                  <p>{formatDate(order.date)}</p>
                </div>

                <div>
                  <span className="order-muted">Payment</span>
                  <p>{order.payment || "Pending"}</p>
                </div>

                <div>
                  <span className="order-muted">Total Amount</span>
                  <p className="order-total">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="order-products">
                {products.map((product, index) => (
                  <div className="order-product" key={product.id ?? index}>
                    <div className="order-product-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      ) : null}
                    </div>

                    <div className="order-product-details">
                      <h4>{product.name || "Product"}</h4>
                      <p>Qty: {product.quantity || 1}</p>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-actions">
                <button
                  type="button"
                  className="order-details-btn"
                  onClick={() => setSelectedOrder(isExpanded ? null : orderKey)}
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                  <span>{isExpanded ? "⌃" : "›"}</span>
                </button>

                <Link to="/" className="order-again-btn">
                  Buy Again
                </Link>
              </div>

              {isExpanded && (
                <div className="order-expanded-details">
                  <h4>Order Details</h4>
                  <p>Order Number: {order.orderNumber || order.id}</p>
                  <p>Order Date: {formatDate(order.date)}</p>
                  <p>Payment Status: {order.payment || "Pending"}</p>
                  <p>Order Status: {order.status || "Processing"}</p>
                  <p>Payment Method: {order.paymentMethod || "N/A"}</p>
                  <p>Subtotal: {formatPrice(order.subtotal)}</p>
                  <p>Discount: {formatPrice(order.discount)}</p>
                  <p>GST: {formatPrice(order.gst)}</p>
                  <p>Total Paid: {formatPrice(order.total)}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default OrderHistory;
