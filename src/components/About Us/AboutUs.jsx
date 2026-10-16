import React from "react";
import "./AboutUs.css";
import AboutImg from "../../assets/gallery-4.png";

import {
  Spa,
  Favorite,
  Verified,
  Nature,
  Groups,
  LocalFlorist,
  ArrowForward,
} from "@mui/icons-material";

import gallery1 from "../../assets/gallery-1.png";
import gallery2 from "../../assets/gallery-2.png";
import gallery3 from "../../assets/gallery-3.png";
import gallery4 from "../../assets/gallery-4.png";
import gallery5 from "../../assets/gallery-5.png";

const images = [
  {
    src: gallery1,
    alt: "Ayurvedic herbs and natural ingredients",
    className: "gallery-img-1",
  },
  {
    src: gallery2,
    alt: "Traditional Ayurvedic oil and herbal ingredients",
    className: "gallery-img-2",
  },
  {
    src: gallery3,
    alt: "Natural herbal oils and Ayurvedic products",
    className: "gallery-img-3",
  },
  {
    src: gallery4,
    alt: "Traditional mortar and pestle with fresh herbs",
    className: "gallery-img-4",
  },
  {
    src: gallery5,
    alt: "Ayurvedic herbs and spices in clay bowls",
    className: "gallery-img-5",
  },
];

function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <span className="about-eyebrow">
            <Spa /> ABOUT OUR BRAND
          </span>

          <h1>
            Nature's Goodness,
            <br />
            <span>Our Promise.</span>
          </h1>

          <p>
            Discover the timeless wisdom of Ayurveda through products inspired
            by nature, rooted in tradition, and designed for your everyday
            wellness routine.
          </p>

          <a href="#our-story" className="about-hero-btn">
            Discover Our Story <ArrowForward />
          </a>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story" id="our-story">
        <div className="about-story-image">
          <img src={AboutImg} alt="Natural herbs and Ayurvedic ingredients" />

          <div className="about-image-label">
            <Spa />
            <span>Inspired by Nature</span>
          </div>
        </div>

        <div className="about-story-content">
          <span className="about-section-label">ABOUT US</span>

          <h2>
            Rooted in Tradition,
            <span> Made for Modern Life.</span>
          </h2>

          <p>
            Ayurveda is India's traditional system of medicine, built on a
            holistic approach to health and well-being. Its rich heritage
            continues to inspire generations through the thoughtful use of
            herbs, natural ingredients, and time-honoured wellness practices.
          </p>

          <p>
            Arya Vaidya Sala, Kottakkal (AVS), was founded by Vaidyaratnam P. S.
            Varier on October 12, 1902, in Kerala, India. What began as a humble
            village clinic has grown into a renowned institution dedicated to
            Ayurvedic healthcare, education, research, and traditional
            treatments.
          </p>

          <p>
            Alongside its healthcare services, AVS supports charitable medical
            care for deserving patients. Its legacy reflects a continued
            commitment to preserving Ayurvedic knowledge and making healthcare
            accessible.
          </p>

          <div className="about-story-points">
            <div>
              <Verified />
              <span>Quality-Focused Products</span>
            </div>

            <div>
              <LocalFlorist />
              <span>Nature-Inspired Care</span>
            </div>

            <div>
              <Favorite />
              <span>Wellness for Everyday Life</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-values">
        <div className="about-values-heading">
          <span className="about-section-label">WHAT WE BELIEVE IN</span>

          <h2>Our Values, Our Promise</h2>

          <p>
            Thoughtful choices, trusted traditions, and care that puts your
            well-being first.
          </p>
        </div>

        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-icon">
              <Nature />
            </div>

            <h3>Nature First</h3>

            <p>
              We celebrate nature's richness and the traditional wisdom of
              Ayurveda in our approach to everyday care.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <Verified />
            </div>

            <h3>Quality Matters</h3>

            <p>
              We value thoughtful product selection, consistent standards, and
              attention to every detail.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <Groups />
            </div>

            <h3>Customer Care</h3>

            <p>
              We aim to make exploring products and finding the right everyday
              essentials a simple experience.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <Favorite />
            </div>

            <h3>Wellness for All</h3>

            <p>
              We want to make nature-inspired care and wellness traditions
              accessible to modern lifestyles.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="Gallery-section">
        <div className="gallery-heading">
          <h2>Our Gallery</h2>
          <p>
            Moments from Kottakkal Arya Vaidya Sala — where tradition, healing,
            <br className="gallery-desktop-break" />
            and care come together in harmony.
          </p>
        </div>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div className={`gallery-item ${image.className}`} key={index}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="about-cta">
        <div>
          <span>DISCOVER NATURAL CARE</span>

          <h2>Make Wellness Part of Your Everyday.</h2>

          <p>
            Explore products inspired by nature and the heritage of Ayurveda.
          </p>
        </div>

        <a href="/Home" className="about-cta-btn">
          Explore Products <ArrowForward />
        </a>
      </section>
    </div>
  );
}

export default AboutUs;
