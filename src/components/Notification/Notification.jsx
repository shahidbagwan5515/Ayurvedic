import { useState } from "react";
import "./Notification.css";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const initialNotifications = [
  {
    id: 1,
    title: "Welcome to VedaRoots Naturals!",
    message:
      "Welcome! Discover the goodness of Ayurveda and explore our natural healthcare products.",
    date: "Today",
    time: "Just now",
    type: "welcome",
    unread: true,
  },
  {
    id: 2,
    title: "Order Placed Successfully",
    message:
      "Your Ayurvedic product order has been placed successfully. Thank you for shopping with us.",
    date: "Today",
    time: "10:30 AM",
    type: "order",
    unread: true,
  },
  {
    id: 3,
    title: "Your Order is on the Way!",
    message: "Good news! Your order has been shipped and will reach you soon.",
    date: "Yesterday",
    time: "04:20 PM",
    type: "shipping",
    unread: false,
  },
  {
    id: 4,
    title: "Special Ayurvedic Offers",
    message:
      "Explore our natural wellness collection and enjoy exciting offers on selected products.",
    date: "Yesterday",
    time: "11:00 AM",
    type: "offer",
    unread: false,
  },
  {
    id: 5,
    title: "Thank You for Joining Us",
    message:
      "Your journey towards natural wellness starts here. Stay healthy and stay natural!",
    date: "28 Oct 2026",
    time: "09:15 AM",
    type: "welcome",
    unread: false,
  },
];

function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeTab, setActiveTab] = useState("All");

  const unreadCount = notifications.filter((item) => item.unread).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "Unread") return item.unread;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBagOutlinedIcon />;
      case "shipping":
        return <LocalShippingOutlinedIcon />;
      case "offer":
        return <LocalOfferOutlinedIcon />;
      default:
        return <SpaOutlinedIcon />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-page">
      <div className="notification-container">
        {/* PAGE HEADER */}
        <div className="notification-page-header">
          <div className="notification-title">
            <div>
              <h2>Notifications</h2>
              <p>Stay updated with your Ayurvedic wellness journey.</p>
            </div>
          </div>

          <div className="notification-header-actions">
            <button
              className="mark-all-btn"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <DoneAllOutlinedIcon />
              Mark all as read
            </button>
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="notification-list-wrapper">
          <div className="notification-list-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest updates and announcements</p>
            </div>

            <button
              className="clear-all-btn"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <DeleteOutlineOutlinedIcon />
              Clear all
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="notification-tabs">
            <button
              className={activeTab === "All" ? "active" : ""}
              onClick={() => setActiveTab("All")}
            >
              All
              <span>{notifications.length}</span>
            </button>

            <button
              className={activeTab === "Unread" ? "active" : ""}
              onClick={() => setActiveTab("Unread")}
            >
              Unread
              <span>{unreadCount}</span>
            </button>
          </div>

          <div className="notification-items">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div
                  className={`notification-card ${
                    item.unread ? "notification-unread" : ""
                  }`}
                  key={item.id}
                >
                  <div className={`notification-card-icon ${item.type}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="notification-card-content">
                    <div className="notification-card-top">
                      <h4>{item.title}</h4>

                      {item.unread && <span className="unread-badge">New</span>}
                    </div>

                    <p>{item.message}</p>

                    <div className="notification-meta">
                      <span>
                        <AccessTimeOutlinedIcon />
                        {item.date} · {item.time}
                      </span>
                    </div>
                  </div>

                  <div className="notification-card-actions">
                    {item.unread && (
                      <button
                        title="Mark as read"
                        onClick={() => markAsRead(item.id)}
                      >
                        <DoneAllOutlinedIcon />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      onClick={() => deleteNotification(item.id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <div className="empty-icon">
                  <NotificationsActiveOutlinedIcon />
                </div>
                <h3>No Notifications Found</h3>
                <p>
                  You're all caught up! We'll notify you when something new
                  arrives.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
