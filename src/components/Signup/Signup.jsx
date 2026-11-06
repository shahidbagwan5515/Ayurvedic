import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Singup.css";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Signup() {
  const navigate = useNavigate();

  const API_URL =
    "http://localhost/Ayurvedic/ayurvedic-app/Backend/api/signup.php";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // HANDLE PHONE CHANGE
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));

    setError("");
  };

  // HANDLE SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;

    // NAME VALIDATION
    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    // EMAIL VALIDATION
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // PHONE VALIDATION
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    // PASSWORD VALIDATION
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // TERMS VALIDATION
    if (!agree) {
      setError("Please accept Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      // PHP API CONNECTION
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      // API RESPONSE
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Registration failed. Please try again.",
        );
      }

      // SUCCESS
      alert("Signup successful! Welcome to our store.");

      // RESET FORM
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setAgree(false);
      setShowPassword(false);

      // REDIRECT TO HOME PAGE
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* HEADING */}
        <div className="signup-heading">
          <h2>Create Account</h2>
          <p>Join us and experience natural wellness.</p>
        </div>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div className="signup-field">
            <div className="signup-input-box">
              <PersonIcon />

              <input
                id="signup-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="signup-field">
            <div className="signup-input-box">
              <EmailIcon />

              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="signup-field">
            <div className="signup-input-box">
              <PhoneIcon />

              <input
                id="signup-phone"
                type="tel"
                name="phone"
                placeholder="Enter mobile number"
                value={form.phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
                maxLength={10}
                inputMode="numeric"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="signup-field">
            <div className="signup-input-box">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <label className="signup-terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <span>
              I agree to the <Link to="/terms">Terms & Conditions</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </span>
          </label>

          {/* ERROR */}
          {error && (
            <p className="signup-error" role="alert">
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="signup-divider">
          <span>OR</span>
        </div>

        {/* LOGIN LINK */}
        <p className="signup-login-text">
          Already have an account?{" "}
          <Link to="/Login" className="signup-login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
