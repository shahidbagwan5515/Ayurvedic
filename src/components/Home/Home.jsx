import React from "react";
import { useState } from "react";
import "./Home.css";
import BannerImg1 from "../../assets/website_banners-07.webp";
import BannerImg2 from "../../assets/tooth_paste.webp";
import BannerImg3 from "../../assets/vibha-men-banner.webp";

import BannerImg4 from "../../assets/vibha_featured_image.webp";
import ProductCard from "../Product-Card/ProductCard";
import ayurLog from "../../assets/ayur-log.svg";
import Footer from "../Footer/Footer";

import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
function Home({ onAddToCart }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = [BannerImg1, BannerImg2, BannerImg3];
  const features = [
    {
      icon: <SpaOutlinedIcon />,
      title: "100% Natural",
      text: "& Herbal",
    },
    {
      icon: <LocalShippingOutlinedIcon />,
      title: "Free Shipping",
      text: "Above ₹499",
    },
    {
      icon: <VerifiedUserOutlinedIcon />,
      title: "Secure Payments",
      text: "100% Safe",
    },
    {
      icon: <HeadsetMicOutlinedIcon />,
      title: "24/7 Customer Support",
      text: "We're here to help",
    },
    {
      icon: <StarOutlinedIcon />,
      title: "Authentic Products",
      text: "Direct from Kottakkal",
    },
  ];
  return (
    <>
      <section className="home-section">
        <div className="banner-container">
          {/* LEFT SLIDER */}
          <div className="banner-box banner-left">
            <img src={banners[activeSlide]} alt="Ayurvedic Product Banner" />

            {/* Dots */}
            <div className="slider-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${
                    activeSlide === index ? "active" : ""
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
          <div className="banner-right">
            <img src={BannerImg4} alt="" srcset="" />
          </div>
        </div>

        <div className="secure-box">
          {features.map((item, index) => (
            <React.Fragment key={index}>
              <div className="secure-item">
                <div className="secure-icon">{item.icon}</div>

                <div className="secure-content">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>

              {index !== features.length - 1 && (
                <div className="secure-divider"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="shoping-producd">
          <div className="conten-box">
            <img src={ayurLog} alt="" /> Customer Favorite
          </div>
          <div className="card-section">
            <ProductCard onAddToCart={onAddToCart} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
