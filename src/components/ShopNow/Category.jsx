import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import PrdInquary from "../DetailsCard/PrdInquary";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import product1 from "../../assets/dealsImg1.png";
import product2 from "../../assets/dealsImg2.jpg";
import product3 from "../../assets/dealsImg3.jpg";
import product4 from "../../assets/dealsImg4.jpg";
import product5 from "../../assets/dealsImg5.jpg";
import product6 from "../../assets/dealsImg6.jpg";

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

const initialProducts = [
  {
    id: 1,
    name: "Saraswatarishtam",
    price: 940,
    qty: "200 Ml",
    image: product1,
    category: "Arishtas and Asavas",
    type: "OTC",
    stock: true,
    prescription: false,
  },
  {
    id: 2,
    name: "Saptarishtam",
    price: 235,
    qty: "450 Ml",
    image: product2,
    category: "Arishtas and Asavas",
    type: "Prescription",
    stock: true,
    prescription: true,
  },
  {
    id: 3,
    name: "Balamritam",
    price: 180,
    qty: "450 Ml",
    image: product3,
    category: "Arishtas and Asavas",
    type: "OTC",
    stock: true,
    prescription: false,
  },
  {
    id: 4,
    name: "Ashwagandharishtam",
    price: 290,
    qty: "450 Ml",
    image: product4,
    category: "Arishtas and Asavas",
    type: "OTC",
    stock: false,
    prescription: false,
  },
  {
    id: 5,
    name: "Mullakadyrishtam",
    price: 260,
    qty: "450 Ml",
    image: product5,
    category: "Arishtas and Asavas",
    type: "Prescription",
    stock: true,
    prescription: true,
  },
  {
    id: 6,
    name: "Chitrakasavam",
    price: 310,
    qty: "450 Ml",
    image: product6,
    category: "Arishtas and Asavas",
    type: "Prescription",
    stock: false,
    prescription: true,
  },
];

function Category({ onAddToCart, wishlistItems = [], onWishlistChange }) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([
    "Arishtas and Asavas",
  ]);

  const [stockFilter, setStockFilter] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);

  // Sorting
  const [sortBy, setSortBy] = useState("newest");

  // Wishlist and Cart
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({});

  // Section open/close
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);

  // Category checkbox
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  // Product type checkbox
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  // Remove selected category
  const removeCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((item) => item !== category));
  };

  // Clear all filters
  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setStockFilter("all");
    setMinPrice(0);
    setMaxPrice(3000);
    setSortBy("newest");
  };

  // Clear price
  const clearPrice = () => {
    setMinPrice(0);
    setMaxPrice(3000);
  };

  // Wishlist toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Add to cart
  const addToCart = (product) => {
    if (!onAddToCart) {
      console.error("onAddToCart function is not passed from parent!");
      return;
    }

    onAddToCart({
      ...product,
      quantity: 1,
      selectedSize: product.qty,
    });
  };
  // Total cart quantity
  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    // Stock filter
    if (stockFilter === "in") {
      result = result.filter((product) => product.stock);
    } else if (stockFilter === "out") {
      result = result.filter((product) => !product.stock);
    }

    // Product type filter
    if (selectedTypes.length > 0) {
      result = result.filter((product) => selectedTypes.includes(product.type));
    }

    // Price filter
    result = result.filter(
      (product) =>
        product.price >= Number(minPrice) && product.price <= Number(maxPrice),
    );

    // Sorting
    switch (sortBy) {
      case "low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [
    selectedCategories,
    stockFilter,
    selectedTypes,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  if (selectedProduct) {
    return (
      <PrdInquary
        key={selectedProduct.id}
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <div
      className={`category-page ${mobileFilterOpen ? "mobile-filter-open" : ""}`}
    >
      {/* FILTER SIDEBAR */}
      <aside className="category-filter">
        <button
          className="mobile-filter-close"
          onClick={() => setMobileFilterOpen(false)}
          aria-label="Close filters"
        >
          <CloseIcon />
        </button>
        <div className="filter-heading">
          <h2>Filter</h2>
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        </div>

        {/* SELECTED FILTERS */}
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

        {/* STOCK FILTER */}
        <div className="stock-filter">
          <label>
            <input
              type="radio"
              name="stock"
              checked={stockFilter === "in"}
              onChange={() => setStockFilter("in")}
            />
            <span>In Stock</span>
          </label>

          <label>
            <input
              type="radio"
              name="stock"
              checked={stockFilter === "out"}
              onChange={() => setStockFilter("out")}
            />
            <span>Out of Stock</span>
          </label>
        </div>

        <div className="filter-line" />

        {/* CATEGORY FILTER */}
        <div className="filter-section">
          <div
            className="filter-section-title"
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <h3>Categories</h3>
            <KeyboardArrowDownIcon
              className={categoryOpen ? "arrow-open" : ""}
            />
          </div>

          {categoryOpen && (
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
          )}
        </div>

        <div className="filter-line" />

        {/* PRODUCT TYPE */}
        <div className="filter-section">
          <div
            className="filter-section-title"
            onClick={() => setTypeOpen(!typeOpen)}
          >
            <h3>Product Type</h3>
            <KeyboardArrowDownIcon className={typeOpen ? "arrow-open" : ""} />
          </div>

          {typeOpen && (
            <div className="category-list">
              {["Prescription", "OTC"].map((type) => (
                <label className="category-check" key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-line" />

        {/* PRICE FILTER */}
        <div className="price-section">
          <div className="price-title">
            <h3 onClick={() => setPriceOpen(!priceOpen)}>Price</h3>
            <button className="clear-btn" onClick={clearPrice}>
              Clear All
            </button>
          </div>

          {priceOpen && (
            <>
              <div className="price-inputs">
                <label>
                  Min Price
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        Math.min(3000, Math.max(0, Number(e.target.value))),
                      )
                    }
                  />
                </label>

                <label>
                  Max Price
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        Math.min(3000, Math.max(0, Number(e.target.value))),
                      )
                    }
                  />
                </label>
              </div>

              <div className="price-values">
                <span>₹ {minPrice}</span>
                <span>₹ {maxPrice}</span>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* PRODUCTS SECTION */}
      <main className="products-section">
        <div className="products-header">
          <button
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <FilterAltOutlinedIcon />
            Filter
          </button>

          <h1>
            Products{" "}
            <span>({filteredProducts.length.toString().padStart(2, "0")})</span>
          </h1>

          {/* SORT */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort By: Newest</option>
            <option value="low">Price - Low to High</option>
            <option value="high">Price - High to Low</option>
            <option value="az">Name: A to Z</option>
            <option value="za">Name: Z to A</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-image-box">
                  {product.prescription && (
                    <span className="prescription">Prescription</span>
                  )}

                  <button
                    className="wishlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      onWishlistChange?.(
                        wishlistItems.includes(product.id)
                          ? wishlistItems.filter((id) => id !== product.id)
                          : [...wishlistItems, product.id],
                      );
                    }}
                  >
                    {wishlistItems.includes(product.id) ? (
                      <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </button>

                  <img src={product.image} alt={product.name} />

                  {!product.stock && (
                    <span className="out-stock-label">Out of Stock</span>
                  )}
                </div>

                <div className="product-details">
                  <h2>{product.name}</h2>

                  <h3>₹{product.price.toFixed(2)}</h3>

                  <div className="product-bottom">
                    <div className="quantity">
                      <span>Qty:</span>
                      <select defaultValue={product.qty}>
                        <option>100 Ml</option>
                        <option>200 Ml</option>
                        <option>450 Ml</option>
                        <option>1 L</option>
                      </select>
                    </div>

                    <button
                      className="add-cart"
                      disabled={!product.stock}
                      onClick={(e) => {
                        e.stopPropagation();

                        addToCart(product);

                        alert(`${product.name} added to cart successfully!`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h2>No Products Found</h2>
            <p>Try changing your filters to see more products.</p>
            <button className="add-cart" onClick={clearAll}>
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Category;
