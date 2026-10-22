import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  WhatsApp,
  Phone,
  Chat,
  Close,
  Send,
  Verified,
  Email,
  LocationOn,
} from "@mui/icons-material";

import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  IconButton,
  TextField,
  Paper,
  Typography,
  Button,
} from "@mui/material";

function Footer() {
  const [activeSection, setActiveSection] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  // Replace with your real WhatsApp business number.
  // Include country code without +, spaces, or hyphens.
  const phoneNumber = "911234567890";

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const openWhatsApp = (message = "") => {
    const text = encodeURIComponent(message);

    const url = `https://wa.me/${phoneNumber}${text ? `?text=${text}` : ""}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const callUs = () => {
    window.location.href = `tel:+${phoneNumber}`;
  };

  const sendChatMessage = (e) => {
    e.preventDefault();

    const message = chatMessage.trim();

    if (!message) return;

    openWhatsApp(message);
    setChatMessage("");
  };

  const accordionIcon = (section) =>
    activeSection === section ? <KeyboardArrowUp /> : <KeyboardArrowDown />;

  return (
    <footer className="footer">
      {/* FOOTER TOP */}
      <div className="footer-top">
        <div className="footer-brand">
          <div>
            <h2>Ayurvedic</h2>
            <p>Natural Care. Better Life.</p>
          </div>
        </div>

        <div className="footer-trust">
          <Verified />
          <p>Authentic Ayurvedic Products</p>
        </div>
      </div>

      <div className="footer-line" />

      {/* FOOTER CONTENT */}
      <div className="footer-content">
        {/* COMPANY */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("company")}
          >
            <span>Company</span>
            <span className="accordion-icon">{accordionIcon("company")}</span>
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

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("quick")}
          >
            <span>Quick Links</span>
            <span className="accordion-icon">{accordionIcon("quick")}</span>
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

        {/* CATEGORIES */}
        <div className="footer-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("categories")}
          >
            <span>Categories</span>
            <span className="accordion-icon">
              {accordionIcon("categories")}
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

        {/* CONTACT US */}
        <div className="footer-column contact-column">
          <h3
            className="footer-accordion-title"
            onClick={() => toggleSection("contact")}
          >
            <span>Contact Us</span>
            <span className="accordion-icon">{accordionIcon("contact")}</span>
          </h3>

          <div
            className={`footer-accordion-content ${
              activeSection === "contact" ? "active" : ""
            }`}
          >
            <div className="contact-item">
              <div className="contact-icon">
                <Phone />
              </div>

              <div>
                <span>Call Us</span>
                <a className="contact-detail" href={`tel:+${phoneNumber}`}>
                  +91 1234567890
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Email />
              </div>

              <div>
                <span>Email Us</span>
                <a
                  className="contact-detail"
                  href="mailto:contact@superadmin.com"
                >
                  contact@superadmin.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <LocationOn />
              </div>

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

        {/* NEWSLETTER */}
        <div className="footer-newsletter">
          <h3>Stay Connected</h3>

          <p>
            Get updates about new products, offers and Ayurvedic wellness tips.
          </p>

          <form
            className="newsletter-box"
            onSubmit={(e) => {
              e.preventDefault();
              // Connect your newsletter API here.
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
              required
            />

            <button type="submit">Subscribe</button>
          </form>

          <div className="social-links">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              ▶
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 Ayurvedic. All Rights Reserved.</p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>
      </div>

      {/* FLOATING SPEED DIAL */}
      <SpeedDial
        ariaLabel="Customer support options"
        className="footer-speed-dial"
        direction="up"
        icon={<SpeedDialIcon icon={<Chat />} openIcon={<Close />} />}
        FabProps={{
          sx: {
            bgcolor: "#174D2D",
            color: "#fff",
            "&:hover": {
              bgcolor: "#103b21",
            },
          },
        }}
      >
        {/* WHATSAPP ACTION */}
        <SpeedDialAction
          icon={<WhatsApp />}
          tooltipTitle="WhatsApp"
          slotProps={{
            fab: {
              sx: {
                bgcolor: "#25D366",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#1DA851",
                },
              },
            },
          }}
          onClick={() =>
            openWhatsApp("Hello, I need help with your Ayurvedic products.")
          }
        />

        {/* CALL ACTION */}
        <SpeedDialAction
          icon={<Phone />}
          tooltipTitle="Call Us"
          slotProps={{
            fab: {
              sx: {
                bgcolor: "#198754",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#146c43",
                },
              },
            },
          }}
          onClick={callUs}
        />

        {/* CHATBOT ACTION */}
        <SpeedDialAction
          icon={<Chat />}
          tooltipTitle="Chatbot"
          slotProps={{
            fab: {
              sx: {
                bgcolor: "#174D2D",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#103b21",
                },
              },
            },
          }}
          onClick={() => setChatOpen((prev) => !prev)}
        />
      </SpeedDial>

      {/* CHATBOT WINDOW */}
      {chatOpen && (
        <Paper
          elevation={8}
          className="mui-chat-window"
          role="dialog"
          aria-label="Ayurvedic customer support chat"
        >
          {/* CHAT HEADER */}
          <div className="mui-chat-header">
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                Ayurvedic Support
              </Typography>

              <Typography variant="caption">How can we help you?</Typography>
            </div>

            <IconButton
              color="inherit"
              onClick={() => setChatOpen(false)}
              aria-label="Close chatbot"
            >
              <Close />
            </IconButton>
          </div>

          {/* CHAT BODY */}
          <div className="mui-chat-body">
            <Typography className="mui-chat-message">
              Namaste! 🙏 Welcome to Ayurvedic. Please tell us how we can help
              you.
            </Typography>

            <div className="mui-chat-options">
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  setChatMessage("I need help choosing a product.")
                }
              >
                Product Help
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  setChatMessage("I want to check my order status.")
                }
              >
                Order Status
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  setChatMessage("I have a question about delivery.")
                }
              >
                Delivery Help
              </Button>
            </div>
          </div>

          {/* CHAT INPUT */}
          <form className="mui-chat-input" onSubmit={sendChatMessage}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              inputProps={{
                "aria-label": "Type your message",
              }}
              required
            />

            <IconButton
              type="submit"
              aria-label="Send message"
              sx={{ color: "#198754" }}
            >
              <Send />
            </IconButton>
          </form>
        </Paper>
      )}
    </footer>
  );
}

export default Footer;
