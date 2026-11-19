import React, { useState, useEffect, useCallback } from "react";
import "./Notification.css";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import { getNotificationUserId } from "../../utils/notificationService";

const API_URL =
  "https://solcarelifesciences.com/demo/Ajit_lab_apis/Backend-Web/api/notifications.php";

// Get actual logged-in user
const getLoggedInUserId = () => {
  try {
    const userId = localStorage.getItem("user_id");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    const id = Number(
      userId ||
        user?.id ||
        user?.user_id ||
        user?.userId ||
        loggedInUser?.id ||
        loggedInUser?.user_id ||
        0,
    );

    return Number.isInteger(id) && id > 0 ? id : null;
  } catch (error) {
    console.error("User ID Error:", error);
    return null;
  }
};

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const USER_ID = getNotificationUserId();

  // =====================================
  // FETCH NOTIFICATIONS FROM DATABASE
  // =====================================

  const fetchNotifications = useCallback(async () => {
    if (!USER_ID) {
      setNotifications([]);
      setLoading(false);
      setError("Please login to view your notifications.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}?user_id=${encodeURIComponent(USER_ID)}&_=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch notifications.");
      }

      const notificationData = result.data?.notifications || [];

      // IMPORTANT: Only current customer's notifications
      const formattedNotifications = notificationData
        .filter((item) => Number(item.user_id) === USER_ID)
        .map((item) => ({
          ...item,
          id: Number(item.id),
          user_id: Number(item.user_id),
          is_read:
            item.is_read === true || item.is_read === 1 || item.is_read === "1",
        }));

      setNotifications(formattedNotifications);

      window.dispatchEvent(new Event("notificationUpdated"));
    } catch (err) {
      console.error("Notification Fetch Error:", err);
      setNotifications([]);
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [USER_ID]);

  // =====================================
  // INITIAL FETCH
  // =====================================
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  // =====================================
  // COMMON POST API
  // =====================================

  const postAction = async (action, extraData = {}) => {
    if (!USER_ID) {
      alert("Please login first.");
      return false;
    }
    try {
      setActionLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: USER_ID,
          action,
          ...extraData,
        }),
      });

      const result = await response.json();

      console.log("Notification Action Response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Notification action failed");
      }

      await fetchNotifications();

      window.dispatchEvent(new Event("notificationUpdated"));

      return true;
    } catch (err) {
      console.error("Notification Action Error:", err);
      alert(err.message || "Something went wrong");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================
  // MARK SINGLE AS READ
  // =====================================

  const markAsRead = async (id) => {
    await postAction("mark_read", { id: Number(id) });
  };

  // =====================================
  // MARK ALL AS READ
  // =====================================

  const markAllRead = async () => {
    await postAction("mark_all_read");
  };

  // =====================================
  // DELETE SINGLE
  // =====================================

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?",
    );

    if (!confirmDelete) return;

    await postAction("delete", { id: Number(id) });
  };

  // =====================================
  // CLEAR ALL
  // =====================================

  const clearAll = async () => {
    if (notifications.length === 0) return;

    const confirmClear = window.confirm(
      "Are you sure you want to clear all notifications?",
    );

    if (!confirmClear) return;

    await postAction("clear_all");
  };

  // =====================================
  // UNREAD COUNT
  // =====================================

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  // =====================================
  // FILTER
  // =====================================

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "Unread") {
      return !item.is_read;
    }

    return true;
  });

  // =====================================
  // NOTIFICATION ICON
  // =====================================

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

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(String(dateValue).replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================
  // UI
  // =====================================

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
              disabled={unreadCount === 0 || actionLoading || loading}
            >
              <DoneAllOutlinedIcon />
              Mark all as read
            </button>

            <button
              className="mark-all-btn"
              onClick={fetchNotifications}
              disabled={loading || actionLoading}
            >
              Refresh
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
              disabled={notifications.length === 0 || actionLoading || loading}
            >
              <DeleteOutlineOutlinedIcon />
              Clear all
            </button>
          </div>

          {/* TABS */}

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

          {/* NOTIFICATION ITEMS */}

          <div className="notification-items">
            {loading ? (
              <div className="notification-empty">
                <h3>Loading Notifications...</h3>
                <p>Please wait while we fetch your notifications.</p>
              </div>
            ) : error ? (
              <div className="notification-empty">
                <h3>Unable to Load Notifications</h3>
                <p>{error}</p>

                <button className="mark-all-btn" onClick={fetchNotifications}>
                  Try Again
                </button>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div
                  className={`notification-card ${
                    !item.is_read ? "notification-unread" : ""
                  }`}
                  key={item.id}
                >
                  {/* ICON */}

                  <div className={`notification-card-icon ${item.type}`}>
                    {getIcon(item.type)}
                  </div>

                  {/* CONTENT */}

                  <div className="notification-card-content">
                    <div className="notification-card-top">
                      <h4>{item.title}</h4>

                      {!item.is_read && (
                        <span className="unread-badge">New</span>
                      )}
                    </div>

                    <p>{item.message}</p>

                    <div className="notification-meta">
                      <span>
                        <AccessTimeOutlinedIcon />
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="notification-card-actions">
                    {!item.is_read && (
                      <button
                        title="Mark as read"
                        disabled={actionLoading}
                        onClick={() => markAsRead(item.id)}
                      >
                        <DoneAllOutlinedIcon />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      disabled={actionLoading}
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
