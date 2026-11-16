import React, { useEffect, useState } from "react";
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

const ACCOUNT_API =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend-Web/api/signup.php";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // =====================================
  // GET LOGGED IN USER
  // =====================================

  const getStoredUser = () => {
    try {
      const storedUser =
        JSON.parse(localStorage.getItem("user") || "null") ||
        JSON.parse(localStorage.getItem("loggedInUser") || "null") ||
        {};

      const id =
        storedUser.id ||
        storedUser.user_id ||
        storedUser.userId ||
        localStorage.getItem("user_id");

      return {
        ...storedUser,
        id: id ? String(id) : "",
      };
    } catch (error) {
      console.error("User storage error:", error);
      return {};
    }
  };

  // =====================================
  // FETCH CUSTOMER FROM DATABASE
  // =====================================

  const fetchAccount = async () => {
    const storedUser = getStoredUser();

    if (!storedUser.id) {
      setMessage("Please login to view your account.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${ACCOUNT_API}?id=${encodeURIComponent(storedUser.id)}`,
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch account.");
      }

      const customer = result.data;

      setUser(customer);

      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });

      // Keep local user data updated
      const updatedUser = {
        ...storedUser,
        ...customer,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (localStorage.getItem("loggedInUser")) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Account Fetch Error:", error);
      setMessage(error.message || "Unable to load account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // UPDATE CUSTOMER PROFILE
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      setMessage("Please enter a valid 10 digit mobile number.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(ACCOUNT_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed.");
      }

      const updatedUser = {
        ...user,
        ...result.data,
      };

      setUser(updatedUser);
      setFormData({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (localStorage.getItem("loggedInUser")) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile Update Error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE CUSTOMER ACCOUNT
  // =====================================

  const handleDelete = async () => {
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
        },
        body: JSON.stringify({
          id: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Account deletion failed.");
      }

      // Clear customer login information
      localStorage.removeItem("user");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user_id");

      setUser({});
      setMessage("Account deleted successfully!");

      navigate("/Login", {
        replace: true,
        state: {
          message: "Your account has been deleted successfully.",
        },
      });
    } catch (error) {
      console.error("Account Delete Error:", error);
      setMessage(error.message);
    } finally {
      setDeleting(false);
    }
  };

  // =====================================
  // CANCEL EDITING
  // =====================================

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    setIsEditing(false);
  };

  // =====================================
  // PROFILE INITIALS
  // =====================================

  const displayName = user.name || "Customer";

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
  // NOT LOGGED IN
  // =====================================

  if (!user.id) {
    return (
      <div className="account-page">
        <div className="account-container" style={{ textAlign: "center" }}>
          <h2>Login Required</h2>
          <p>{message || "Please login to view your account."}</p>
          <Link to="/Login">Go to Login</Link>
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
              className="account-edit-button"
              onClick={() => setIsEditing(true)}
            >
              <EditOutlinedIcon />
              Edit Profile
            </button>
          ) : (
            <button
              className="account-edit-button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* NOTIFICATION */}

        {message && (
          <div
            style={{
              padding: "13px 18px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#edf7ed",
              color: "#246b36",
            }}
            role="status"
          >
            {message}
            <button
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

            {/* SAVE BUTTON */}

            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "25px",
                  gap: "12px",
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
