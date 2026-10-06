import "./Deals.css";
import { useState } from "react";
import BannerImg1 from "../../assets/vibha-men-banner.webp";
import BannerImg2 from "../../assets/tooth_paste.webp";
import BannerImg3 from "../../assets/website_banners-07.webp";
import ProductCard from "../Product-Card/ProductCard";
import dealsLogo from "../../assets/ayur-log.svg";
function Deals() {
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = [BannerImg1, BannerImg2, BannerImg3];

  return (
    <>
      <div className="section-deals">
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
        </div>

        <div className="deals-card">
          <p className="heding-deals">
            {" "}
            <img src={dealsLogo} alt="" />
            Offers
          </p>
          <ProductCard />
        </div>
      </div>
    </>
  );
}

export default Deals;
