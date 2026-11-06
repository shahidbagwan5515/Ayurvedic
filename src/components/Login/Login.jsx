import React, { useState } from "react";
import { Drawer } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import "./Login.css";

const API_URL =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend/api/login.php";

function Login({ open, onClose }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed.");
      }

      alert("Login successful! Welcome " + result.data.name);

      setForm({
        email: "",
        password: "",
      });

      setShowPassword(false);

      if (onClose) {
        onClose();
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open ?? true}
      onClose={onClose || (() => navigate("/"))}
      className="login-drawer"
      PaperProps={{
        className: "login-paper",
      }}
    >
      <div className="login-container">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="login-close-btn"
          onClick={onClose || (() => navigate("/"))}
        >
          <CloseIcon />
        </button>

        {/* LOGO */}
        <div className="login-logo">
          <div className="logo-circle">✿</div>

          <div className="logo-text">
            <span>Health Feature Lorem, ipsum dolor.</span>
            <strong>AYURVEDIC</strong>
          </div>
        </div>

        <h2>Welcome to Login</h2>

        {/* LOGIN FORM */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          {/* PASSWORD */}
          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Type here"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="forgot-password">
            <button type="button">Forgot Password</button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* OTP BUTTON */}
          <button type="button" className="otp-btn" disabled>
            Login with OTP
          </button>
        </form>

        {/* SIGNUP LINK */}
        <div className="Sign-up">
          <p>
            Don't have an account? <Link to="/Signup">Sign up</Link>
          </p>
        </div>
      </div>
    </Drawer>
  );
}

export default Login;
