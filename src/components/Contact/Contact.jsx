import React from "react";
import "./Contact.css";

// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
// import MailOutlineIcon from "@mui/icons-material/MailOutline";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been submitted.");
    e.target.reset();
  };

  return (
    <div className="contact-page">
      {/* Top Banner */}
      <div className="contact-banner"></div>

      <div className="contact-container">
        {/* Left Content */}
        <div className="contact-left">
          {/* Breadcrumb */}
          <div className="contact-breadcrumb">
            <a href="/Home">Home</a>
            <ChevronRightIcon />
            <span>Contact Us</span>
          </div>

          {/* Heading */}
          <div className="contact-intro">
            <h1>Let's Stay In Touch</h1>
            <p>
              Stay connected—we're here to help with anything you need. Drop us
              a message and we'll be in touch shortly.
            </p>
          </div>

          {/* Contact Information */}
          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-icon">
                <LocalPhoneOutlinedIcon />
              </div>
              <a href="tel:+914842554021">+91 1234567890</a>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon">
                <MailOutlineOutlinedIcon />
              </div>
              <a href="mailto:contact@aryavaidyasala.com">
                contact@superadmin.com
              </a>
            </div>

            <div className="contact-detail-item address-item">
              <div className="contact-icon">
                <PlaceOutlinedIcon />
              </div>
              <p>
                Lorem, ipsum dolor,
                <br />
                Lorem ipsum dolor sit.
                <br />
                1234, INDIA.
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="contact-social">
            <span>Follow us on</span>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <span className="x-social-icon">𝕏</span>
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="contact-form-card">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="contact-name">Full Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                placeholder="Type here"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-email">Email ID</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="Type here"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-mobile">Mobile Number</label>
              <input
                type="tel"
                id="contact-mobile"
                name="mobile"
                placeholder="Type here"
                pattern="[0-9+\-\s]{10,15}"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Type here"
                rows="4"
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
