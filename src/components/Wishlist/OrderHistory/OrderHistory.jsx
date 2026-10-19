import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./OrderHistory.css";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Prdimg1 from "../../../assets/nimbapatradi_churnam.jpg";
import Prdimg2 from "../../../assets/psorakot.png";
const initialOrders = [
  {
    id: "ORD-2026-001",
    date: "18 Oct 2026",
    status: "Delivered",
    total: 128.57,
    payment: "Paid",
    products: [
      {
        id: 1,
        name: "Kottakkal Ayurveda Skin Protection Soap (3+1)",
        image: Prdimg1,
        quantity: 1,
        price: 128.57,
      },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "12 Oct 2026",
    status: "Processing",
    total: 150,
    payment: "Paid",
    products: [
      {
        id: 2,
        name: "Kottakkal Ayurveda Toothpaste",
        image: Prdimg2,
        quantity: 1,
        price: 150,
      },
    ],
  },
];

function OrderHistory({ orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

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

      {orders.length === 0 ? (
        <div className="order-empty">
          <div className="order-empty-icon">▣</div>
          <h2>No orders found</h2>
          <p>Your orders will appear here when you make a purchase.</p>

          <Link to="/" className="order-shop-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="order-history-list">
          {orders.map((order) => (
            <article className="order-history-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <span className="order-muted">Order ID</span>
                  <h3>{order.id}</h3>
                </div>

                <span className="order-status status-processing">
                  <span className="status-dot" />
                  {order.status}
                </span>
              </div>

              <div className="order-card-info">
                <div>
                  <span className="order-muted">Order Date</span>
                  <p>{order.date}</p>
                </div>

                <div>
                  <span className="order-muted">Payment</span>
                  <p>{order.payment}</p>
                </div>

                <div>
                  <span className="order-muted">Total Amount</span>
                  <p className="order-total">
                    ₹{Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="order-products">
                {order.products.map((product, index) => (
                  <div className="order-product" key={product.id ?? index}>
                    <div className="order-product-image">
                      <img
                        src={product.image || product.img}
                        alt={product.name || "Product"}
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    </div>

                    <div className="order-product-details">
                      <h4>{product.name}</h4>
                      <p>Qty: {product.quantity}</p>
                      <strong>₹{Number(product.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-actions">
                <button
                  type="button"
                  className="order-details-btn"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order.id ? null : order.id,
                    )
                  }
                >
                  {selectedOrder === order.id ? "Hide Details" : "View Details"}
                  <span>{selectedOrder === order.id ? "⌃" : "›"}</span>
                </button>

                <Link to="/" className="order-again-btn">
                  Buy Again
                </Link>
              </div>

              {selectedOrder === order.id && (
                <div className="order-expanded-details">
                  <h4>Order Details</h4>
                  <p>Order Number: {order.id}</p>
                  <p>Order Date: {order.date}</p>
                  <p>Payment Status: {order.payment}</p>
                  <p>Order Status: {order.status}</p>
                  <p>Total Paid: ₹{Number(order.total).toFixed(2)}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrderHistory;
