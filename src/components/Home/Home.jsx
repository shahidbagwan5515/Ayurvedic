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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import categoryImg01 from "../../assets/categoryImg06.webp";
import categoryImg02 from "../../assets/categoryImg07.webp";
import categoryImg03 from "../../assets/categoryImg10.webp";
import categoryImg04 from "../../assets/categoryImg04.webp";
import categoryImg05 from "../../assets/categoryImg03.webp";
import categoryImg06 from "../../assets/immunity_booster-01.webp";
import categoryImg07 from "../../assets/pain_management-02.webp";

import EastIcon from "@mui/icons-material/East";
import dealsLogo from "../../assets/ayur-log.svg";
import dealsImg1 from "../../assets/dealsImg1.png";
import dealsImg2 from "../../assets/dealsImg2.jpg";
import dealsImg3 from "../../assets/dealsImg3.jpg";
import dealsImg4 from "../../assets/dealsImg4.jpg";
import dealsImg5 from "../../assets/dealsImg5.jpg";
import dealsImg6 from "../../assets/dealsImg6.jpg";

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

function Home({ onAddToCart }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const [active, setActive] = useState(0);

  const banners = [BannerImg1, BannerImg2, BannerImg3];

  const categories = [
    {
      title: "Non Prescription Medicines",
      Image: categoryImg01,
      color: "green",
    },
    {
      title: "OTC/FMCG Products",
      Image: categoryImg02,
      color: "green",
    },
    {
      title: "Skin Care Products",
      Image: categoryImg03,
      color: "yellow",
    },
    {
      title: "Hair care products",
      Image: categoryImg04,
      color: "green",
    },
    {
      title: "Daily Bite Gummies",
      Image: categoryImg05,
      color: "green",
    },
    {
      title: "Immunity Boosters",
      Image: categoryImg06,
      color: "yellow",
    },
    {
      title: "Pain Management",
      Image: categoryImg07,
      color: "yellow",
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

        <section className="categories-section">
          <div className="categories-header">
            <h2>
              <span className="category-logo">🌿</span>
              Categories
            </h2>

            <button className="view-all-btn">
              <span>View All</span>
              <span className="arrow-box">
                <ArrowForwardIcon />
              </span>
            </button>
          </div>

          <div className="Categories-boxs">
            {categories.map((item, index) => (
              <div
                className={`category-item ${
                  active === index ? "selected" : ""
                }`}
                key={item.title}
                onClick={() => setActive(index)}
              >
                <div className="category-circle-wrapper">
                  <div className={`category-circle ${item.color}`}>
                    <img
                      src={item.Image}
                      alt={item.title}
                      className="category-icon"
                    />
                  </div>
                </div>

                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="shoping-producd">
          <div className="conten-box">
            <img src={ayurLog} alt="" /> Customer Favorite
          </div>
          <div className="card-section">
            <ProductCard onAddToCart={onAddToCart} />
          </div>
        </div>

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
      </section>
    </>
  );
}

export default Home;
