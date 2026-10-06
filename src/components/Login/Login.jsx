import "./Login.css";

import * as React from "react";
import Drawer from "@mui/material/Drawer";

import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function Login({ open, onClose }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        className="login-drawer"
      >
        <div className="login-container">
          {/* Close Button */}
          <button className="login-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>

          {/* Logo */}
          <div className="login-logo">
            <div className="logo-circle">✿</div>

            <div className="logo-text">
              <span>Health Feature Lorem, ipsum dolor.</span>
              <strong>AYURVEDIC </strong>
            </div>
          </div>

          {/* Heading */}
          <h2>Hello, Welcome Back</h2>

          {/* Form */}
          <div className="login-form">
            {/* Email */}
            <label>Email</label>

            <input type="email" placeholder="Enter your email" />

            {/* Password */}
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Type here"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="forgot-password">
              <button type="button">Forgot Password</button>
            </div>

            {/* Login */}
            <button className="login-btn">Login</button>

            {/* OTP */}
            <button className="otp-btn">Login with OTP</button>
          </div>
          <div className="Sign-up">
            <p>
              Don't have an account? <Link to="/Signin">Sign up</Link>
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default Login;
