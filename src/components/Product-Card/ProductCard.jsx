import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import PrdInquary from "../DetailsCard/PrdInquary";

import cardimg1 from "../../assets/banner-1.jpeg";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL =
  "https://plyexpert.com/shaheedApis/Backend-dashboard/api/product.php";

const STOCK_API_URL =
  "https://plyexpert.com/shaheedApis/Backend-dashboard/api/stock.php";

const IMAGE_BASE_URL = "http://localhost";

// =====================================
// IMAGE URL HELPER
// =====================================

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return cardimg1;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${IMAGE_BASE_URL}/${image.replace(/^\/+/, "")}`;
};

// =====================================
// STOCK HELPER
// =====================================

const getStockValue = (product) => {
  const value =
    product?.quantity ??
    product?.stock ??
    product?.stock_quantity ??
    product?.available_stock ??
    0;

  const stock = Number(value);

  return Number.isFinite(stock) ? Math.max(0, stock) : 0;
};

// =====================================
// PRODUCT CARD COMPONENT
// =====================================

function ProductCard({
  onAddToCart,
  onProductClick,
  wishlistItems = [],
  onWishlistChange,
  onProductsChange,
}) {
  // =====================================
  // STATES
  // =====================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [quantities, setQuantities] = useState({});

  const scrollRef = useRef(null);

  const navigate = useNavigate();

  // =====================================
  // FETCH PRODUCT + STOCK API
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const requestOptions = {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        };

        // Fetch both APIs
        const [productResponse, stockResponse] = await Promise.all([
          fetch(API_URL, requestOptions),
          fetch(STOCK_API_URL, requestOptions),
        ]);

        if (!productResponse.ok) {
          throw new Error(`Product API failed: ${productResponse.status}`);
        }

        const productResult = await productResponse.json();

        if (!productResult.success || !Array.isArray(productResult.data)) {
          throw new Error(productResult.message || "Unable to fetch products.");
        }

        // =====================================
        // FETCH STOCK DATA
        // =====================================

        let stockData = [];

        if (stockResponse.ok) {
          const stockResult = await stockResponse.json();

          console.log("STOCK API RESPONSE:", stockResult);

          if (stockResult.success && Array.isArray(stockResult.data)) {
            stockData = stockResult.data;
          }
        } else {
          console.warn("Stock API unavailable:", stockResponse.status);
        }

        console.log("PRODUCT API RESPONSE:", productResult);

        // =====================================
        // NORMALIZE SKU
        // =====================================

        const normalize = (value) =>
          String(value || "")
            .trim()
            .toLowerCase();

        // =====================================
        // FORMAT PRODUCTS
        // =====================================

        const formattedProducts = productResult.data
          .filter(
            (product) => String(product.status).toLowerCase() === "active",
          )
          .map((product) => {
            const images = Array.isArray(product.images) ? product.images : [];

            // Match product SKU with stock product_code
            const matchingStock = stockData.find(
              (stockItem) =>
                normalize(stockItem.product_code) === normalize(product.sku),
            );

            // Use actual stock API quantity when SKU matches
            const availableStock = matchingStock
              ? getStockValue(matchingStock)
              : getStockValue(product);

            const formattedProduct = {
              ...product,

              id: Number(product.id),

              name: product.name || "Unnamed Product",

              sku: product.sku || "",

              category: product.category || "Ayurvedic Medicine",

              description: product.description || "",

              price: Number(product.price) || 0,

              stock: availableStock,

              supplier: matchingStock?.supplier_name || product.supplier || "",

              images: images.map(getImageUrl),

              image: images.length > 0 ? getImageUrl(images[0]) : cardimg1,

              sizes: [],

              oldPrice: null,
            };

            console.log(
              `${formattedProduct.name} | SKU: ${formattedProduct.sku} | Stock: ${formattedProduct.stock}`,
            );

            return formattedProduct;
          });

        console.log("FINAL PRODUCTS WITH STOCK:", formattedProducts);

        if (!controller.signal.aborted) {
          setProducts(formattedProducts);

          setQuantities((previous) => {
            const updated = {};

            formattedProducts.forEach((product) => {
              updated[product.id] = Math.min(
                previous[product.id] || 1,
                Math.max(1, product.stock),
              );
            });

            return updated;
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Product Fetch Error:", err);

          setError(err.message || "Failed to load products.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  // =====================================
  // SEND PRODUCTS TO PARENT
  // =====================================

  useEffect(() => {
    onProductsChange?.(products);
  }, [products, onProductsChange]);

  // =====================================
  // AUTO SCROLL
  // =====================================

  useEffect(() => {
    const container = scrollRef.current;

    if (!container || products.length === 0) return;

    let animationId;
    let paused = false;

    const autoScroll = () => {
      if (!paused) {
        container.scrollLeft += 0.5;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 2
        ) {
          container.scrollLeft = 0;
        }
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    container.addEventListener("touchstart", pause, {
      passive: true,
    });

    container.addEventListener("touchend", resume, {
      passive: true,
    });

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);

      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, [products.length]);

  // =====================================
  // INCREASE QUANTITY
  // =====================================

  const increaseQty = (id) => {
    const product = products.find((item) => item.id === id);

    if (!product || product.stock <= 0) return;

    setQuantities((previous) => {
      const current = previous[id] || 1;

      if (current >= product.stock) {
        setCartMessage("Maximum available stock reached!");
        setSnackbarOpen(true);

        return previous;
      }

      return {
        ...previous,
        [id]: current + 1,
      };
    });
  };

  // =====================================
  // DECREASE QUANTITY
  // =====================================

  const decreaseQty = (id) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) - 1),
    }));
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const handleBuyNow = (product) => {
    const quantity = quantities[product.id] || 1;

    if (product.stock <= 0) {
      setCartMessage("Product is out of stock!");
      setSnackbarOpen(true);
      return;
    }

    if (quantity > product.stock) {
      setCartMessage("Requested quantity is not available!");
      setSnackbarOpen(true);
      return;
    }

    if (typeof onAddToCart !== "function") {
      setCartMessage("Cart functionality is not connected.");
      setSnackbarOpen(true);
      return;
    }

    onAddToCart({
      ...product,
      quantity,
      selectedSize: product.sizes?.[0] || "",
    });

    setCartMessage(`${product.name} added to cart successfully!`);

    setSnackbarOpen(true);
  };

  // =====================================
  // ADD / REMOVE WISHLIST
  // =====================================

  const toggleWishlist = (product) => {
    // CHECK LOGIN
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login first to use your wishlist.");
      navigate("/Login");
      return;
    }

    if (typeof onWishlistChange !== "function") {
      setCartMessage("Wishlist functionality is not connected.");
      setSnackbarOpen(true);
      return;
    }

    const exists = wishlistItems.some(
      (item) => String(item.id) === String(product.id),
    );

    if (exists) {
      onWishlistChange((previous) =>
        previous.filter((item) => String(item.id) !== String(product.id)),
      );
    } else {
      const wishlistProduct = {
        ...product,
        stock: Number(product.stock),
        inStock: Number(product.stock) > 0,
      };

      onWishlistChange((previous) => [...previous, wishlistProduct]);
    }

    setCartMessage(
      exists
        ? `${product.name} removed from wishlist!`
        : `${product.name} added to wishlist!`,
    );

    setSnackbarOpen(true);
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return <div className="product-loading">Loading products...</div>;
  }

  // =====================================
  // ERROR UI
  // =====================================

  if (error) {
    return (
      <div className="product-error">
        <p>{error}</p>

        <button type="button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // =====================================
  // EMPTY PRODUCTS
  // =====================================

  if (products.length === 0) {
    return (
      <div className="product-empty">No products available right now.</div>
    );
  }

  // =====================================
  // PRODUCT INQUIRY
  // =====================================

  if (selectedProduct) {
    return (
      <PrdInquary
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  // =====================================
  // MAIN PRODUCT UI
  // =====================================

  return (
    <>
      <section className="prdcard-section" ref={scrollRef}>
        {products.map((product) => {
          const isWishlisted = wishlistItems.some(
            (item) => String(item.id) === String(product.id),
          );

          const quantity = quantities[product.id] || 1;

          const inStock = product.stock > 0;

          return (
            <div className="product-card" key={product.id}>
              {/* PRODUCT IMAGE */}

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = cardimg1;
                  }}
                  onClick={() => {
                    if (onProductClick) {
                      onProductClick(product);
                    } else {
                      setSelectedProduct(product);
                    }
                  }}
                />

                {/* DISCOUNT */}

                {product.oldPrice > product.price && (
                  <span className="product-offer">
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                )}

                {/* WISHLIST BUTTON */}

                <button
                  type="button"
                  className={`product-wishlist-btn ${
                    isWishlisted ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWishlist(product);
                  }}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  title={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <FavoriteOutlinedIcon />
                </button>
              </div>

              {/* PRODUCT DETAILS */}

              <div className="product-content">
                <span className="product-category">{product.category}</span>

                <h3>{product.name}</h3>

                <p className="product-description">{product.description}</p>

                {/* STOCK */}

                <p
                  className="product-stock-info"
                  style={{
                    color: inStock ? "#16834a" : "#dc2626",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {inStock
                    ? `Available Stock: ${product.stock}`
                    : "Out of Stock"}
                </p>

                {/* PRICE AND QUANTITY */}

                <div className="product-footer">
                  <div className="price-wrapper">
                    <span className="product-price">
                      ₹{product.price.toFixed(2)}
                    </span>

                    {product.oldPrice > product.price && (
                      <span className="old-price">₹{product.oldPrice}</span>
                    )}
                  </div>

                  {/* QUANTITY */}

                  <div
                    className="quantity-box"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => decreaseQty(product.id)}
                      disabled={!inStock || quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQty(product.id)}
                      disabled={!inStock || quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ADD TO CART */}

                <button
                  type="button"
                  className="buy-now-btn"
                  disabled={!inStock}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleBuyNow(product);
                  }}
                >
                  {inStock ? "Add to Cart" : "Out of Stock"}

                  <ShoppingCartIcon className="buyIcon-btn" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          content: {
            sx: {
              backgroundColor: "#176b45",
              color: "white",
            },
          },
        }}
        message={cartMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            aria-label="Close notification"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default ProductCard;
