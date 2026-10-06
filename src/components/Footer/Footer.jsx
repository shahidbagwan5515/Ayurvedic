import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="footer-brand">
          {/* <div className="brand-icon">🌿</div> */}

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
          <h3>Company</h3>

          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Delivery & Shipping</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Blogs</a>
          <a href="#">Refund Policy</a>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/Mycard">My Cart</a>
          <a href="#">Wishlist</a>
          <a href="#">Publications</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* Categories */}
        <div className="footer-column">
          <h3>Categories</h3>

          <a href="#">Kashayam</a>
          <a href="#">Churnams</a>
          <a href="#">Tailam</a>
          <a href="#">Tablets</a>
          <a href="#">Ghrithams</a>
          <a href="#">Lehams</a>
        </div>

        {/* Contact */}
        <div className="footer-column contact-column">
          <h3>Contact Us</h3>

          <div className="contact-item">
            <div className="contact-icon">☎</div>
            <div>
              <span>Call Us</span>
              <p>+91 484 2554021</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">✉</div>
            <div>
              <span>Email Us</span>
              <p>contact@aryavaidysala.com</p>
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

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Stay Connected</h3>

          <p>
            Get updates about new products, offers and Ayurvedic wellness tips.
          </p>

          <div className="newsletter-box">
            <input type="email" placeholder="Your email address" />

            <button>Subscribe</button>
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

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Ayurvedic. All Rights Reserved.</p>

        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
