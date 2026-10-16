import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
function Footer() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="footer-brand">
          <div>
            <h2>Ayurvedic</h2>
            <p>Natural Care. Better Life.</p>
          </div>
        </div>

        <div className="footer-trust">
          <span>✓</span>
          <p>Authentic Ayurvedic Products</p>
        </div>
      </div>

      <div className="footer-line"></div>

      {/* Footer Content */}
      <div className="footer-content">
        {/* Company */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("company")}
          >
            <span>Company</span>
            <span className="accordion-icon">
              {activeSection === "company" ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </h3>

          <div
            className={`footer-accordion-content ${
              activeSection === "company" ? "active" : ""
            }`}
          >
            <Link to="/AboutUs">About Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/delivery-shipping">Delivery &amp; Shipping</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/Blog">Blogs</Link>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("quick")}
          >
            <span>Quick Links</span>
            <span className="accordion-icon">
              {activeSection === "company" ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </h3>

          <div
            className={`footer-accordion-content ${
              activeSection === "quick" ? "active" : ""
            }`}
          >
            <Link to="/">Home</Link>
            <Link to="/Mycard">My Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/publications">Publications</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        {/* Categories */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("categories")}
          >
            <span>Categories</span>
            <span className="accordion-icon">
              {activeSection === "company" ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </h3>

          <div
            className={`footer-accordion-content ${
              activeSection === "categories" ? "active" : ""
            }`}
          >
            <Link to="/Category?type=Kashayam">Kashayam</Link>
            <Link to="/Category?type=Churnams">Churnams</Link>
            <Link to="/Category?type=Tailam">Tailam</Link>
            <Link to="/Category?type=Tablets">Tablets</Link>
            <Link to="/Category?type=Ghrithams">Ghrithams</Link>
            <Link to="/Category?type=Lehams">Lehams</Link>
          </div>
        </div>

        {/* Contact Us */}
        <div className="footer-column contact-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("contact")}
          >
            <span>Contact Us</span>
            <span className="accordion-icon">
              {activeSection === "company" ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </h3>

          <div
            className={`footer-accordion-content ${
              activeSection === "contact" ? "active" : ""
            }`}
          >
            <div className="contact-item">
              <div className="contact-icon">☎</div>
              <div>
                <span>Call Us</span>
                <p>+91 1234567890</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉</div>
              <div>
                <span>Email Us</span>
                <p>contact@superadmin.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">⌖</div>
              <div>
                <span>Visit Us</span>
                <p>
                  Head office, Kottakkal (PO),
                  <br />
                  Malappuram (Dist.), Kerala,
                  <br />
                  676 503, INDIA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Stay Connected</h3>

          <p>
            Get updates about new products, offers and Ayurvedic wellness tips.
          </p>

          <div className="newsletter-box">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
            />
            <button type="button">Subscribe</button>
          </div>

          <div className="social-links">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
            <a href="#" aria-label="YouTube">
              ▶
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Ayurvedic. All Rights Reserved.</p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
