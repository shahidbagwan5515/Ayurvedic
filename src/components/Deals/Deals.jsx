import "./Deals.css";
import { useState } from "react";

import PrdInquary from "../DetailsCard/PrdInquary";

import BannerImg1 from "../../assets/vibha-men-banner.webp";
import BannerImg2 from "../../assets/tooth_paste.webp";
import BannerImg3 from "../../assets/website_banners-07.webp";

import ProductCard from "../Product-Card/ProductCard";
import dealsLogo from "../../assets/ayur-log.svg";

import EastIcon from "@mui/icons-material/East";

import dealsImg1 from "../../assets/dealsImg1.png";
import dealsImg2 from "../../assets/dealsImg2.jpg";
import dealsImg3 from "../../assets/dealsImg3.jpg";
import dealsImg4 from "../../assets/dealsImg4.jpg";
import dealsImg5 from "../../assets/dealsImg5.jpg";
import dealsImg6 from "../../assets/dealsImg6.jpg";

import BottomBanner1 from "../../assets/dealsbanner1.webp";
import BottomBanner2 from "../../assets/dealsbanners2.webp";

function Deals({ onAddToCart }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // TOP BANNERS
  const banners = [BannerImg1, BannerImg2, BannerImg3];

  // IMMUNITY PRODUCTS
  const immunityProducts = [
    {
      id: 1,
      name: "Dasamularishtam",
      price: 130,
      oldPrice: 160,
      image: dealsImg1,
      category: "Immunity Booster",
      description:
        "Dasamularishtam is an Ayurvedic herbal formulation traditionally used to support immunity and overall wellness.",
      sizes: ["200ml", "450ml"],
    },

    {
      id: 2,
      name: "Chyavanaprasam",
      price: 285,
      oldPrice: 320,
      image: dealsImg2,
      category: "Immunity Booster",
      description:
        "Chyavanaprasam is a traditional Ayurvedic herbal preparation designed to support immunity, strength and general wellness.",
      sizes: ["250g", "500g"],
    },

    {
      id: 3,
      name: "Brahma Rasayanam",
      price: 235,
      oldPrice: 270,
      image: dealsImg3,
      category: "Immunity Booster",
      description:
        "Brahma Rasayanam is an Ayurvedic herbal formulation traditionally used for overall health and wellness.",
      sizes: ["250g", "500g"],
    },

    {
      id: 4,
      name: "Indukanthamritham",
      price: 180,
      oldPrice: 210,
      image: dealsImg4,
      category: "Immunity Booster",
      description:
        "Indukanthamritham is a traditional Ayurvedic formulation used for supporting general wellness.",
      sizes: ["200ml", "450ml"],
    },

    {
      id: 5,
      name: "C-Health granule",
      price: 300,
      oldPrice: 350,
      image: dealsImg5,
      category: "Immunity Booster",
      description:
        "C-Health granule is an Ayurvedic wellness product formulated for daily health support.",
      sizes: ["100g", "200g"],
    },

    {
      id: 6,
      name: "Geniekot Syrup",
      price: 165,
      oldPrice: 195,
      image: dealsImg6,
      category: "Immunity Booster",
      description:
        "Geniekot Syrup is an Ayurvedic herbal formulation for supporting general health and wellness.",
      sizes: ["100ml", "200ml"],
    },
  ];

  return (
    <div className="section-deals">
      {selectedProduct ? (
        //{ PRODUCT DETAIL }
        <PrdInquary
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      ) : (
        <>
          <div className="banner-container">
            <div className="banner-box banner-left">
              <img src={banners[activeSlide]} alt="Ayurvedic Product Banner" />

              {/* SLIDER DOTS */}
              <div className="slider-dots">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${
                      activeSlide === index ? "active" : ""
                    }`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="deals-card">
            <div className="heding-deals">
              <p>
                <img src={dealsLogo} alt="Ayurvedic" />
                Customer Favorite
              </p>

              <div className="rightErro">
                <span>View All</span>

                <EastIcon className="east-icon" />
              </div>
            </div>

            <ProductCard />
          </div>

          {/* IMMUNITY BOOSTERS */}

          <div className="Immunity-box">
            {/* HEADING */}

            <div className="immunity-heading">
              <div className="immunity-title">
                <img src={dealsLogo} alt="Ayurvedic" />

                <h2>Immunity Boosters</h2>
              </div>

              <div className="immunity-view">
                <span>View All</span>

                <EastIcon />
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="immunity-products">
              {immunityProducts.map((product, index) => (
                <div
                  className="immunity-product"
                  key={index}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="immunity-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="immunity-info">
                    <h3>{product.name}</h3>

                    <strong>₹{product.price}.00</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM BANNERS */}

          <div className="bottom-banner">
            <div className="bottom-banner-item">
              <img src={BottomBanner1} alt="Hair Nourishing Oil" />
            </div>

            <div className="bottom-banner-item">
              <img src={BottomBanner2} alt="Nourishing Shampoo" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Deals;
