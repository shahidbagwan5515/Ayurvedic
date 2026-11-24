import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

import PrdInquary from "../DetailsCard/PrdInquary";
import cardimg1 from "../../assets/banner-1.jpeg";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { createNotification } from "../../utils/notificationService";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL = "https://akshayurja.in/ExpensesApp/ShaheedApis/product.php";

const STOCK_API_URL = "https://akshayurja.in/ExpensesApp/ShaheedApis/stock.php";

const IMAGE_BASE_URL = "http://localhost";

// =====================================
// IMAGE URL HELPER
// =====================================

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return cardimg1;
  }

  const cleanImage = image.trim();

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:image/")
  ) {
    return cleanImage;
  }

  return `${IMAGE_BASE_URL}/${cleanImage.replace(/^\/+/, "")}`;
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
// NORMALIZE SKU
// =====================================

const normalizeSKU = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
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

  const [refreshKey, setRefreshKey] = useState(0);

  // WISHLIST POPUP STATE
  const [wishlistDialog, setWishlistDialog] = useState({
    open: false,
    type: "success",
    product: null,
    message: "",
  });

  const scrollRef = useRef(null);

  const navigate = useNavigate();

  // =====================================
  // SNACKBAR HELPER
  // =====================================

  const showMessage = useCallback((message) => {
    setCartMessage(message);
    setSnackbarOpen(true);
  }, []);

  // =====================================
  // WISHLIST POPUP HELPER
  // =====================================

  const showWishlistPopup = (type, product, message) => {
    setWishlistDialog({
      open: true,
      type,
      product,
      message,
    });
  };

  const closeWishlistPopup = () => {
    setWishlistDialog((previous) => ({
      ...previous,
      open: false,
    }));
  };

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

        // STOCK API DATA

        let stockData = [];

        if (stockResponse.ok) {
          try {
            const stockResult = await stockResponse.json();

            console.log("STOCK API RESPONSE:", stockResult);

            if (stockResult.success && Array.isArray(stockResult.data)) {
              stockData = stockResult.data;
            }
          } catch (stockError) {
            console.warn("Stock API JSON Error:", stockError);
          }
        } else {
          console.warn("Stock API unavailable:", stockResponse.status);
        }

        console.log("PRODUCT API RESPONSE:", productResult);

        // FORMAT PRODUCTS

        const formattedProducts = productResult.data
          .filter(
            (product) =>
              String(product.status || "").toLowerCase() === "active",
          )
          .map((product) => {
            const images = Array.isArray(product.images) ? product.images : [];

            const productSKU = normalizeSKU(product.sku);

            const matchingStock = productSKU
              ? stockData.find(
                  (stockItem) =>
                    normalizeSKU(stockItem.product_code) === productSKU,
                )
              : null;

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

              oldPrice: Number(product.oldPrice) || null,
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
              const previousQuantity = previous[product.id] || 1;

              updated[product.id] =
                product.stock > 0
                  ? Math.min(previousQuantity, product.stock)
                  : 1;
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
  }, [refreshKey]);

  // =====================================
  // SEND PRODUCTS TO PARENT
  // =====================================

  useEffect(() => {
    onProductsChange?.(products);
  }, [products, onProductsChange]);

  // =====================================
  // RETRY API
  // =====================================

  const retryProducts = () => {
    setRefreshKey((previous) => previous + 1);
  };

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
        showMessage("Maximum available stock reached!");
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
      showMessage("Product is out of stock!");
      return;
    }

    if (quantity > product.stock) {
      showMessage("Requested quantity is not available!");
      return;
    }

    if (typeof onAddToCart !== "function") {
      showMessage("Cart functionality is not connected.");
      return;
    }

    onAddToCart({
      ...product,
      quantity,
      selectedSize: product.sizes?.[0] || "",
    });

    showMessage(`${product.name} added to cart successfully!`);
  };

  // =====================================
  // ADD / REMOVE WISHLIST
  // =====================================

  const toggleWishlist = async (product) => {
    // LOGIN CHECK

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      showWishlistPopup(
        "login",
        product,
        "Please login first to add products to your wishlist.",
      );
      return;
    }

    if (typeof onWishlistChange !== "function") {
      showMessage("Wishlist functionality is not connected.");
      return;
    }

    // CHECK EXISTING PRODUCT

    const exists = wishlistItems.some(
      (item) => String(item.id) === String(product.id),
    );

    // REMOVE FROM WISHLIST

    if (exists) {
      onWishlistChange((previous) =>
        previous.filter((item) => String(item.id) !== String(product.id)),
      );

      showWishlistPopup(
        "removed",
        product,
        `${product.name} has been removed from your wishlist.`,
      );
    } else {
      // ADD TO WISHLIST

      const wishlistProduct = {
        ...product,
        stock: Number(product.stock),
        inStock: Number(product.stock) > 0,
      };

      onWishlistChange((previous) => [
        ...previous.filter((item) => String(item.id) !== String(product.id)),
        wishlistProduct,
      ]);

      showWishlistPopup(
        "success",
        product,
        `${product.name} has been added to your wishlist successfully!`,
      );
    }

    // CREATE NOTIFICATION

    try {
      await createNotification({
        title: exists
          ? "Product Removed from Wishlist"
          : "Product Added to Wishlist",

        message: exists
          ? `${product.name} has been removed from your wishlist.`
          : `${product.name} has been added to your wishlist.`,

        type: "wishlist",
      });
    } catch (notificationError) {
      console.error("Wishlist Notification Error:", notificationError);
    }
  };

  // =====================================
  // PRODUCT CLICK
  // =====================================

  const handleProductClick = (product) => {
    if (typeof onProductClick === "function") {
      onProductClick(product);
    } else {
      setSelectedProduct(product);
    }
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

        <button type="button" onClick={retryProducts}>
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
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = cardimg1;
                  }}
                  onClick={() => handleProductClick(product)}
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

      {/* =====================================
          WISHLIST POPUP
      ===================================== */}

      <Dialog
        open={wishlistDialog.open}
        onClose={closeWishlistPopup}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "12px",
            textAlign: "center",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent>
          {/* <div className={`wishlist-popup-icon ${wishlistDialog.type}`}>
            {wishlistDialog.type === "success" ? (
              <CheckCircleIcon />
            ) : (
              <FavoriteIcon />
            )}
          </div> */}

          <h2 className="wishlist-popup-title">
            {wishlistDialog.type === "success"
              ? "Added to Wishlist!"
              : wishlistDialog.type === "removed"
                ? "Removed from Wishlist"
                : "Login Required"}
          </h2>

          {/* PRODUCT DETAILS */}

          {wishlistDialog.product && (
            <div className="wishlist-popup-product">
              <img
                src={wishlistDialog.product.image || cardimg1}
                alt={wishlistDialog.product.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = cardimg1;
                }}
              />

              <h3>{wishlistDialog.product.name}</h3>

              <span>
                ₹{Number(wishlistDialog.product.price || 0).toFixed(2)}
              </span>
            </div>
          )}

          <p className="wishlist-popup-message">{wishlistDialog.message}</p>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              const isLogin = wishlistDialog.type === "login";

              closeWishlistPopup();

              if (isLogin) {
                navigate("/Login");
              }
            }}
            sx={{
              backgroundColor: "#176b45",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "14px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#0e5134",
                boxShadow: "none",
              },
            }}
          >
            {wishlistDialog.type === "login"
              ? "Login Now"
              : "Continue Shopping"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* =====================================
          CART SNACKBAR
      ===================================== */}

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
              borderRadius: "10px",
              fontWeight: 500,
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
