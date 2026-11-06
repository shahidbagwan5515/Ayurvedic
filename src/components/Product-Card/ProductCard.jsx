import { useState, useEffect, useRef } from "react";
import "./ProductCard.css";
import PrdInquary from "../DetailsCard/PrdInquary";

import cardimg1 from "../../assets/banner-1.jpeg";
import cardimg2 from "../../assets/nimbapatradi_churnam.jpg";
import cardimg3 from "../../assets/shop.jpeg";
import cardimg4 from "../../assets/psorakot.png";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL =
  "http://localhost/Admin-Panel/dashboard/Backend/api/product.php";

const IMAGE_BASE_URL = "http://localhost";

// =====================================
// IMAGE URL HELPER
// =====================================

const getImageUrl = (image) => {
  if (!image) return cardimg1;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${IMAGE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
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

  // =====================================
  // FETCH PRODUCTS FROM PHP API
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Unable to fetch products.");
        }

        // Only active products will be displayed.

        const formattedProducts = result.data
          .filter((product) => product.status?.toLowerCase() === "active")
          .map((product) => {
            const images = Array.isArray(product.images) ? product.images : [];

            return {
              ...product,

              id: Number(product.id),

              name: product.name || "Unnamed Product",

              sku: product.sku || "",

              category: product.category || "Ayurvedic Medicine",

              description: product.description || "",

              price: Number(product.price) || 0,

              stock: Number(product.stock) || 0,

              supplier: product.supplier || "",

              images: images.map((image) => getImageUrl(image)),

              image: images.length > 0 ? getImageUrl(images[0]) : cardimg1,

              sizes: [],

              oldPrice: null,
            };
          });

        setProducts(formattedProducts);

        // Initialize quantities.

        setQuantities((previous) => {
          const updated = {};

          formattedProducts.forEach((product) => {
            updated[product.id] = previous[product.id] || 1;
          });

          return updated;
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Product Fetch Error:", error);

        setError(error.message || "Failed to load products.");
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
  // SEND PRODUCTS TO PARENT COMPONENT
  // =====================================

  useEffect(() => {
    onProductsChange?.(products);
  }, [products, onProductsChange]);

  // =====================================
  // AUTO SCROLL PRODUCT CARDS
  // =====================================

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
        container.scrollLeft += scrollSpeed;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 2
        ) {
          container.scrollLeft = 0;
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
      if (paused) {
        paused = false;
        scrollPauseLoop();
      }
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
  }, [products.length]);

  // =====================================
  // INCREASE QUANTITY
  // =====================================

  const increaseQty = (id) => {
    const product = products.find((item) => item.id === id);

    if (!product || product.stock <= 0) return;

    if ((quantities[id] || 1) >= product.stock) {
      setCartMessage("Maximum available stock reached!");

      setSnackbarOpen(true);

      return;
    }

    setQuantities((previous) => ({
      ...previous,
      [id]: (previous[id] || 1) + 1,
    }));
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
  // ADD PRODUCT TO CART
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
    if (typeof onWishlistChange !== "function") {
      setCartMessage("Wishlist state is not connected in App.jsx.");

      setSnackbarOpen(true);

      return;
    }

    const exists = wishlistItems.some((item) => Number(item.id) === product.id);

    let updatedWishlist;

    if (exists) {
      updatedWishlist = wishlistItems.filter(
        (item) => Number(item.id) !== product.id,
      );
    } else {
      updatedWishlist = [
        ...wishlistItems,
        {
          ...product,

          inStock: product.stock > 0,
        },
      ];
    }

    onWishlistChange(updatedWishlist);

    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlistUpdated"));

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
  // EMPTY PRODUCTS UI
  // =====================================

  if (products.length === 0) {
    return (
      <div className="product-empty">No products available right now.</div>
    );
  }

  // =====================================
  // PRODUCT INQUIRY PAGE
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
  // MAIN PRODUCT CARD UI
  // =====================================

  return (
    <>
      <section className="prdcard-section" ref={scrollRef}>
        {products.map((product) => {
          const isWishlisted = wishlistItems.some(
            (item) => Number(item.id) === product.id,
          );

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

                {/* DISCOUNT BADGE */}

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

                {/* PRODUCT PRICE AND QUANTITY */}

                <div className="product-footer">
                  <div className="price-wrapper">
                    <span className="product-price">₹{product.price}</span>

                    {product.oldPrice > product.price && (
                      <span className="old-price">₹{product.oldPrice}</span>
                    )}
                  </div>

                  {/* QUANTITY BOX */}

                  <div
                    className="quantity-box"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => decreaseQty(product.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{quantities[product.id] || 1}</span>

                    <button
                      type="button"
                      onClick={() => increaseQty(product.id)}
                      aria-label="Increase quantity"
                      disabled={
                        product.stock <= 0 ||
                        (quantities[product.id] || 1) >= product.stock
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ADD TO CART BUTTON */}

                <button
                  type="button"
                  className="buy-now-btn"
                  disabled={product.stock <= 0}
                  onClick={(event) => {
                    event.stopPropagation();

                    handleBuyNow(product);
                  }}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}

                  <ShoppingCartIcon className="buyIcon-btn" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* SUCCESS / ERROR SNACKBAR */}

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
