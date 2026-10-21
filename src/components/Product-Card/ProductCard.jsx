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

const products = [
  {
    id: 1,
    image: cardimg1,
    category: "Skin Care",
    name: "Vibha Sandal Cream",
    description:
      "A premium Ayurvedic cream enriched with natural sandalwood extracts for healthy and glowing skin.",
    price: 250,
    oldPrice: 299,
    sizes: ["50g", "100g", "200g"],
  },
  {
    id: 2,
    image: cardimg2,
    category: "SKU FGC371",
    name: "Nimbapatradi Churnam",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 150,
    oldPrice: 240,
    sizes: ["50g", "100g", "250g"],
  },
  {
    id: 3,
    image: cardimg3,
    category: "Skin Care",
    name: "Vibha Sandal Cream",
    description:
      "A premium Ayurvedic cream enriched with natural sandalwood extracts for healthy and glowing skin.",
    price: 160,
    oldPrice: 250,
    sizes: ["50g", "100g"],
  },
  {
    id: 4,
    image: cardimg4,
    category: "SKU FGC371",
    name: "Handmade Soap",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 198,
    oldPrice: 299,
    sizes: ["75g", "100g"],
  },
  {
    id: 5,
    image: cardimg1,
    category: "Skin Care",
    name: "Vibha Sandal Cream",
    description:
      "A premium Ayurvedic cream enriched with natural sandalwood extracts for healthy and glowing skin.",
    price: 250,
    oldPrice: 299,
    sizes: ["50g", "100g", "200g"],
  },
  {
    id: 6,
    image: cardimg2,
    category: "SKU FGC371",
    name: "Nimbapatradi Churnam",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 150,
    oldPrice: 240,
    sizes: ["50g", "100g", "250g"],
  },
  {
    id: 7,
    image: cardimg4,
    category: "SKU FGC371",
    name: "Handmade Soap",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 198,
    oldPrice: 299,
    sizes: ["75g", "100g"],
  },
];

function ProductCard({
  onAddToCart,
  onProductClick,
  wishlistItems = [],
  onWishlistChange,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const scrollRef = useRef(null);

  const [quantities, setQuantities] = useState(() =>
    products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {}),
  );

  // Auto-scroll product cards.
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
  }, []);

  const increaseQty = (id) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: (previous[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) - 1),
    }));
  };

  // Add product to cart.
  const handleBuyNow = (product) => {
    const quantity = quantities[product.id] || 1;

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

    setCartMessage(`added to cart successfully!`);
    setSnackbarOpen(true);
  };

  // Add/remove wishlist item using shared React state.
  const toggleWishlist = (product) => {
    if (typeof onWishlistChange !== "function") {
      setCartMessage("Wishlist state is not connected in App.jsx.");
      setSnackbarOpen(true);
      return;
    }

    const exists = wishlistItems.some((item) => item.id === product.id);

    let updatedWishlist;

    if (exists) {
      updatedWishlist = wishlistItems.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [
        ...wishlistItems,
        {
          ...product,
          sku: product.category,
          inStock: true,
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

  if (selectedProduct) {
    return (
      <PrdInquary
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <>
      <section className="prdcard-section" ref={scrollRef}>
        {products.map((product) => {
          const isWishlisted = wishlistItems.some(
            (item) => item.id === product.id,
          );

          return (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => {
                    if (onProductClick) {
                      onProductClick(product);
                    } else {
                      setSelectedProduct(product);
                    }
                  }}
                />

                <span className="product-offer">
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100,
                  )}
                  % OFF
                </span>

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

              <div className="product-content">
                <span className="product-category">{product.category}</span>

                <h3>{product.name}</h3>

                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <div className="price-wrapper">
                    <span className="product-price">₹{product.price}</span>

                    <span className="old-price">₹{product.oldPrice}</span>
                  </div>

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
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="buy-now-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleBuyNow(product);
                  }}
                >
                  Add to Cart
                  <ShoppingCartIcon className="buyIcon-btn" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

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
