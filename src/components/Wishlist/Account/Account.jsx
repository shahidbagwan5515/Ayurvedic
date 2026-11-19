import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

import Person from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// =====================================
// API URL
// =====================================

const ACCOUNT_API =
  "https://solcarelifesciences.com/demo/Ajit_lab_apis/Backend-Web/api/signup.php";

// =====================================
// GET STORED USER
// =====================================

const getStoredUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    const currentUser = user || loggedInUser || {};

    const id = Number(
      currentUser.id ||
        currentUser.user_id ||
        currentUser.userId ||
        localStorage.getItem("user_id") ||
        0,
    );

    if (!Number.isSafeInteger(id) || id <= 0) {
      return null;
    }

    return {
      ...currentUser,
      id,
    };
  } catch (error) {
    console.error("User storage error:", error);
    return null;
  }
};

// =====================================
// SAVE USER TO LOCAL STORAGE
// =====================================

const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("user_id", String(user.id));

  window.dispatchEvent(new Event("authChanged"));
};

// =====================================
// CLEAR USER STORAGE
// =====================================

const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("user_id");

  window.dispatchEvent(new Event("authChanged"));
};

// =====================================
// ACCOUNT COMPONENT
// =====================================

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // =====================================
  // SHOW MESSAGE
  // =====================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // =====================================
  // FETCH CUSTOMER ACCOUNT
  // =====================================

  const fetchAccount = useCallback(async () => {
    const storedUser = getStoredUser();

    if (!storedUser?.id) {
      setUser(null);
      setLoading(false);
      showMessage("Please login to view your account.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${ACCOUNT_API}?id=${encodeURIComponent(storedUser.id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch account details.");
      }

      const customer = result.data;

      if (!customer || !customer.id) {
        throw new Error("Customer details not found.");
      }

      const currentCustomer = {
        id: Number(customer.id),
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
      };

      setUser(currentCustomer);

      setFormData({
        name: currentCustomer.name,
        email: currentCustomer.email,
        phone: currentCustomer.phone,
      });

      saveUser(currentCustomer);

      setMessage("");
    } catch (error) {
      console.error("Account Fetch Error:", error);

      showMessage(error.message || "Unable to load account details.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {
    fetchAccount();

    const handleAuthChange = () => {
      setIsEditing(false);
      fetchAccount();
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, [fetchAccount]);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  // =====================================
  // UPDATE CUSTOMER PROFILE
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      showMessage("Please login again.", "error");
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    // Validation

    if (!name) {
      showMessage("Please enter your full name.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      showMessage("Please enter a valid 10 digit mobile number.", "error");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(ACCOUNT_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed.");
      }

      const updatedUser = {
        id: Number(result.data?.id || user.id),
        name: result.data?.name || name,
        email: result.data?.email || email,
        phone: result.data?.phone || phone,
      };

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      });

      saveUser(updatedUser);

      setIsEditing(false);

      showMessage("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Profile Update Error:", error);

      showMessage(error.message || "Profile update failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL EDITING
  // =====================================

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
    setMessage("");
  };

  // =====================================
  // DELETE CUSTOMER ACCOUNT
  // =====================================

  const handleDelete = async () => {
    if (!user?.id) {
      showMessage("Please login again.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(ACCOUNT_API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Account deletion failed.");
      }

      clearUser();

      setUser(null);

      navigate("/Login", {
        replace: true,
        state: {
          message: "Your account has been deleted successfully.",
        },
      });
    } catch (error) {
      console.error("Account Delete Error:", error);

      showMessage(error.message || "Account deletion failed.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================
  // PROFILE INITIALS
  // =====================================

  const displayName = user?.name || "Customer";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-container">
          <p style={{ textAlign: "center", padding: "60px" }}>
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // LOGIN REQUIRED
  // =====================================

  if (!user?.id) {
    return (
      <div className="account-page">
        <div className="account-container" style={{ textAlign: "center" }}>
          <h2>Login Required</h2>

          <p>{message || "Please login to view your account."}</p>

          <Link to="/Login" className="LoginLink">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // =====================================
  // MAIN ACCOUNT PAGE
  // =====================================

  return (
    <div className="account-page">
      <div className="account-container">
        {/* BREADCRUMB */}

        <div className="account-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>My Account</span>
        </div>

        {/* PAGE HEADING */}

        <div className="account-heading">
          <div>
            <span className="account-subtitle">PERSONAL DASHBOARD</span>

            <h1>My Account</h1>

            <p>Manage your personal information and account details.</p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="account-edit-button"
              onClick={() => setIsEditing(true)}
            >
              <EditOutlinedIcon />
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              className="account-edit-button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              padding: "13px 18px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: messageType === "error" ? "#fdecec" : "#edf7ed",
              color: messageType === "error" ? "#b42318" : "#246b36",
            }}
            role="status"
          >
            {message}

            <button
              type="button"
              onClick={() => setMessage("")}
              style={{
                float: "right",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* PROFILE CARD */}

        <section className="account-profile-card">
          <div className="account-avatar">{initials || "C"}</div>

          <div className="account-profile-info">
            <span className="account-welcome">WELCOME BACK</span>

            <h2>{user.name}</h2>

            <p>{user.email}</p>
          </div>

          <div className="account-member">
            <SecurityOutlinedIcon />

            <div>
              <strong>Customer Account</strong>
              <span>Personal Profile</span>
            </div>
          </div>
        </section>

        {/* QUICK LINKS */}

        <div className="account-quick-links">
          <Link to="/OrderHistory" className="account-quick-card">
            <div className="account-quick-icon">
              <ShoppingBagOutlinedIcon />
            </div>

            <div>
              <h3>My Orders</h3>
              <p>Track your orders</p>
            </div>

            <ArrowForwardIosIcon className="account-arrow" />
          </Link>

          <Link to="/Wishlist" className="account-quick-card">
            <div className="account-quick-icon wishlist-icon">
              <FavoriteBorderOutlinedIcon />
            </div>

            <div>
              <h3>My Wishlist</h3>
              <p>View saved products</p>
            </div>

            <ArrowForwardIosIcon className="account-arrow" />
          </Link>
        </div>

        {/* PERSONAL INFORMATION */}

        <section className="account-details-card">
          <div className="account-section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Your personal and contact details</p>
            </div>

            <Person />
          </div>

          <form onSubmit={handleSave}>
            <div className="account-details-grid">
              {/* FULL NAME */}

              <div className="account-field">
                <label>Full Name</label>

                <div className="account-field-value">
                  <Person />

                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <span>{user.name || "Not available"}</span>
                  )}
                </div>
              </div>

              {/* EMAIL */}

              <div className="account-field">
                <label>Email Address</label>

                <div className="account-field-value">
                  <EmailOutlinedIcon />

                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  ) : (
                    <span>{user.email || "Not available"}</span>
                  )}
                </div>
              </div>

              {/* PHONE */}

              <div className="account-field">
                <label>Phone Number</label>

                <div className="account-field-value">
                  <PhoneOutlinedIcon />

                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      maxLength={10}
                      required
                    />
                  ) : (
                    <span>{user.phone || "Not available"}</span>
                  )}
                </div>
              </div>

              {/* CUSTOMER ID */}

              <div className="account-field">
                <label>Customer ID</label>

                <div className="account-field-value">
                  <SecurityOutlinedIcon />
                  <span>{user.id}</span>
                </div>
              </div>
            </div>

            {/* SAVE AND CANCEL */}

            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "25px",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="account-edit-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="account-edit-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* DELETE ACCOUNT */}

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              border: "1px solid #dc2626",
              color: "#dc2626",
              background: "#fff",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: deleting ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>

        {/* FOOTER */}

        <div className="account-footer-note">
          <SecurityOutlinedIcon />

          <p>
            Your personal information is important to us. Keep your account
            details updated.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;
