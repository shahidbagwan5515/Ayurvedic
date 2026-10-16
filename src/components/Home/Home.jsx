import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import PrdInquary from "../DetailsCard/PrdInquary";
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

import FeaturedImg01 from "../../assets/slideImg1.webp";
import FeaturedImg02 from "../../assets/slideImg2.webp";
import FeaturedImg03 from "../../assets/slideImg3.webp";
import FeaturedImg04 from "../../assets/slideImg4.webp";
import FeaturedImg05 from "../../assets/slideImg5.webp";
import FeaturedImg06 from "../../assets/slideImg6.webp";
import FeaturedImg07 from "../../assets/slideImg7.webp";
import FeaturedImg08 from "../../assets/slideImg8.webp";

import BottomBanner1 from "../../assets/dealsbanner1.webp";
import BottomBanner2 from "../../assets/dealsbanners2.webp";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import AdsImg1 from "../../assets/web_banner_hair_care1.webp";

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

const FeaturedCard = [
  {
    title: "Non Prescription Medicines",
    Image: FeaturedImg01,
  },
  {
    title: "OTC/FMCG Products",
    Image: FeaturedImg02,
  },
  {
    title: "Skin Care Products",
    Image: FeaturedImg03,
  },
  {
    title: "Hair care products",
    Image: FeaturedImg04,
  },
  {
    title: "Daily Bite Gummies",
    Image: FeaturedImg05,
  },
  {
    title: "Immunity Boosters",
    Image: FeaturedImg06,
  },
  {
    title: "Pain Management",
    Image: FeaturedImg07,
  },
  {
    title: "Pain Management",
    Image: FeaturedImg08,
  },
];

const steps = [
  {
    icon: <MedicalServicesOutlinedIcon />,
    text: "Choose your medicine & upload your prescription",
  },
  {
    icon: <MedicalInformationOutlinedIcon />,
    text: "Get approved by doctor & make payment",
  },
  {
    icon: <LocalShippingOutlinedIcon />,
    text: "Get delivery at footstep presently in India only",
  },
];

const banners = [BannerImg1, BannerImg2, BannerImg3];

function Home({ onAddToCart }) {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [active, setActive] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [selectedProduct]);

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const FeaturedProducts = () => {
    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      const interval = setInterval(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 5) {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          container.scrollBy({
            left: 250,
            behavior: "smooth",
          });
        }
      }, 3000);

      return () => clearInterval(interval);
    }, []);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId;
    let timeoutId;
    let paused = false;
    let scrolling = true;

    const scrollSpeed = 0.5;
    const scrollDuration = 2000;
    const pauseDuration = 2000;

    const autoScroll = () => {
      if (!paused && scrolling) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll > 0) {
          container.scrollLeft += scrollSpeed;

          if (container.scrollLeft >= maxScroll - 1) {
            container.scrollLeft = 0;
          }
        }
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    const scrollPauseLoop = () => {
      if (paused) return;

      scrolling = true;

      timeoutId = setTimeout(() => {
        scrolling = false;

        timeoutId = setTimeout(() => {
          scrollPauseLoop();
        }, pauseDuration);
      }, scrollDuration);
    };

    const pause = () => {
      paused = true;
      clearTimeout(timeoutId);
    };

    const resume = () => {
      if (!paused) return;

      paused = false;
      scrollPauseLoop();
    };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause, {
      passive: true,
    });
    container.addEventListener("touchend", resume, {
      passive: true,
    });

    scrollPauseLoop();
    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);

      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <>
      {selectedProduct ? (
        <PrdInquary
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      ) : (
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

          {/*  ========= Categories-section ============  */}
          <section className="categories-section">
            <div className="categories-header">
              <h2>
                <span className="categories-logo">
                  <img src={ayurLog} alt="" />
                </span>
                Categories Products
              </h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/ViewProduct")}
              >
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
          {/*  ========= Featured-Products Card ============  */}

          <section className="featured-Products">
            <div className="featured-header">
              <h2>
                <span className="featured-logo">
                  <img src={ayurLog} alt="" />
                </span>
                Featured Products
              </h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/ViewProduct")}
              >
                <span>View All</span>
                <span className="arrow-box">
                  <ArrowForwardIcon />
                </span>
              </button>
            </div>

            <div className="Featured-boxs" ref={scrollRef}>
              {FeaturedCard.map((item, index) => (
                <img
                  key={item.id ?? index}
                  src={item.Image}
                  alt={item.title}
                  className="Product-image"
                />
              ))}
            </div>
          </section>
          {/* ========= Shoping Card ============  */}

          <div className="shoping-producd">
            <div className="featured-header">
              <h2>
                <span className="Shoping-logo">
                  <img src={ayurLog} alt="" />
                </span>
                New Arrivals
              </h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/ViewProduct")}
              >
                <span>View All</span>
                <span className="arrow-box">
                  <ArrowForwardIcon />
                </span>
              </button>
            </div>

            <div className="card-section">
              <ProductCard
                onAddToCart={handleAddToCart}
                onProductClick={(product) => setSelectedProduct(product)}
              />
            </div>
          </div>

          <div className="bottom-banner">
            <div className="bottom-banner-item">
              <img src={BottomBanner1} alt="Hair Nourishing Oil" />
            </div>

            <div className="bottom-banner-item">
              <img src={BottomBanner2} alt="Nourishing Shampoo" />
            </div>
          </div>
          {/* ========= Immunity Shoping Card ============  */}

          <div className="Immunity-box">
            <div className="immunity-heading">
              <div className="immunity-title">
                <img src={dealsLogo} alt="Ayurvedic" />
                <h2>Immunity Boosters</h2>
              </div>

              <button
                className="view-all-btn"
                onClick={() => navigate("/ViewProduct")}
              >
                <span>View All</span>
                <span className="arrow-box">
                  <ArrowForwardIcon />
                </span>
              </button>
            </div>

            <div className="immunity-products">
              {immunityProducts.map((product) => (
                <div
                  className="immunity-product"
                  key={product.id || product.name}
                  onClick={() => setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
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

          {/* ========= Shoping Card ============  */}
          <div className="shoping-producd">
            <div className="featured-header">
              <h2>
                <span className="featured-logo">
                  <img src={ayurLog} alt="" />
                </span>
                Non Prescription Medicines
              </h2>

              <button
                className="view-all-btn"
                onClick={() => navigate("/ViewProduct")}
              >
                <span>View All</span>
                <span className="arrow-box">
                  <ArrowForwardIcon />
                </span>
              </button>
            </div>

            <div className="card-section">
              <ProductCard
                onAddToCart={handleAddToCart}
                onProductClick={(product) => setSelectedProduct(product)}
              />
            </div>
          </div>
          {/* ========= Image Box ============  */}
          <div className="AdsImg-box">
            <img src={AdsImg1} alt={AdsImg1} />
          </div>

          <div className="process-container">
            {steps.map((step, index) => (
              <div className="process-item" key={index}>
                <div className={`process-icon icon-${index + 1}`}>
                  {step.icon}
                </div>

                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
