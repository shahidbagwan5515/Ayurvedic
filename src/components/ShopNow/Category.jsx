import { useState } from "react";
import "./Category.css";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

// Apni actual product images yaha import karo
import product1 from "../../assets/dealsImg1.png";
import product2 from "../../assets/dealsImg2.jpg";
import product3 from "../../assets/dealsImg3.jpg";
import product4 from "../../assets/dealsImg4.jpg";
import product5 from "../../assets/dealsImg5.jpg";
import product6 from "../../assets/dealsImg6.jpg";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
function Category() {
  // =========================
  // SELECTED CATEGORIES
  // =========================

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([
    "Arishtas and Asavas",
  ]);

  const categories = [
    "Arishtas and Asavas",
    "Churnams",
    "Ghrithams",
    "Immunity Boosters",
    "Kashayam",
    "Lehams",
    "Rasakriyas",
    "Patent and Proprietory",
    "Tailams",
  ];

  // =========================
  // CHECKBOX CHANGE
  // =========================

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }

      return [...prev, category];
    });
  };

  // =========================
  // REMOVE SELECTED CATEGORY
  // =========================

  const removeCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((item) => item !== category));
  };

  // =========================
  // CLEAR ALL
  // =========================

  const clearAll = () => {
    setSelectedCategories([]);
  };

  const products = [
    {
      id: 1,
      name: "Saraswatarishtam",
      price: "₹940.00",
      qty: "200 Ml",
      image: product1,
      prescription: false,
    },
    {
      id: 2,
      name: "Saptarishtam",
      price: "₹235.00",
      qty: "450 Ml",
      image: product2,
      prescription: true,
    },
    {
      id: 3,
      name: "Balamritam",
      price: "₹180.00",
      qty: "450 Ml",
      image: product3,
      prescription: false,
    },
    {
      id: 4,
      name: "Ashwagandharishtam",
      price: "₹290.00",
      qty: "450 Ml",
      image: product4,
      prescription: false,
    },
    {
      id: 5,
      name: "Mullakadyrishtam",
      price: "₹260.00",
      qty: "450 Ml",
      image: product5,
      prescription: true,
    },
    {
      id: 6,
      name: "Chitrakasavam",
      price: "₹310.00",
      qty: "450 Ml",
      image: product6,
      prescription: true,
    },
  ];

  return (
    <div
      className={`category-page ${
        mobileFilterOpen ? "mobile-filter-open" : ""
      }`}
    >
      {/* ================= FILTER ================= */}

      <aside className="category-filter">
        <button
          className="mobile-filter-close"
          onClick={() => setMobileFilterOpen(false)}
        >
          <CloseIcon />
        </button>

        <div className="filter-heading">
          <h2>Filter</h2>

          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        </div>

        {/* ================= SELECTED FILTERS ================= */}

        <div className="selected-filters">
          {selectedCategories.map((category) => (
            <div className="selected-filter" key={category}>
              <button
                className="remove-filter"
                onClick={() => removeCategory(category)}
              >
                <CloseIcon />
              </button>

              <span>{category}</span>
            </div>
          ))}
        </div>
        {/* ================= STOCK ================= */}

        <div className="stock-filter">
          <label>
            <input type="radio" name="stock" />
            <span>In Stock</span>
          </label>

          <label>
            <input type="radio" name="stock" />
            <span>Out of Stock</span>
          </label>
        </div>

        <div className="filter-line"></div>

        {/* ================= CATEGORIES ================= */}

        <div className="filter-section">
          <div className="filter-section-title">
            <h3>Categories</h3>

            <KeyboardArrowDownIcon />
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <label className="category-check" key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />

                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-line"></div>

        {/* PRODUCT TYPE */}

        <div className="filter-section collapsed">
          <div className="filter-section-title">
            <h3>Product Type</h3>
            <KeyboardArrowDownIcon />
          </div>
        </div>

        <div className="filter-line"></div>

        {/* PRICE */}

        <div className="price-section">
          <div className="price-title">
            <h3>Price</h3>

            <button className="clear-btn">Clear All</button>
          </div>

          <div className="price-slider">
            <div className="slider-line"></div>

            <span className="slider-circle left"></span>
            <span className="slider-circle right"></span>
          </div>

          <div className="price-values">
            <span>₹ 0</span>
            <span>₹ 3000</span>
          </div>
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}

      <main className="products-section">
        <button
          className="mobile-filter-btn"
          onClick={() => setMobileFilterOpen(true)}
        >
          <FilterAltOutlinedIcon />
        </button>

        <div className="products-header">
          <h1>
            Products <span>(06)</span>
          </h1>

          <select className="sort-select">
            <option>Sort By: Price - High to Low</option>

            <option>Sort By: Price - Low to High</option>

            <option>Sort By: Newest</option>
          </select>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-box">
                {product.prescription && (
                  <span className="prescription">Prescription</span>
                )}

                <button className="wishlist-btn">
                  <FavoriteBorderIcon />
                </button>

                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-details">
                <h2>{product.name}</h2>

                <h3>{product.price}</h3>

                <div className="product-bottom">
                  <div className="quantity">
                    <span>Qty:</span>

                    <select defaultValue={product.qty}>
                      <option>200 Ml</option>
                      <option>450 Ml</option>
                      <option>100 Ml</option>
                      <option>1 L</option>
                    </select>
                  </div>

                  <button className="add-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Category;
