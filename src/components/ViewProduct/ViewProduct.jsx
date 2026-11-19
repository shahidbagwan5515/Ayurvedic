import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ViewProduct.css";

import PrdInquary from "../DetailsCard/PrdInquary";
import cardimg1 from "../../assets/banner-1.jpeg";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

import { createNotification } from "../../utils/notificationService";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL =
  "https://solcarelifesciences.com/demo/Ajit_lab_apis/Backend/api/product.php";

const STOCK_API_URL =
  "https://solcarelifesciences.com/demo/Ajit_lab_apis/Backend/api/stock.php";

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
// SKU NORMALIZE
// =====================================

const normalizeSKU = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

// =====================================
// VIEW PRODUCT COMPONENT
// =====================================

function ViewProduct({ onAddToCart, wishlistItems = [], onWishlistChange }) {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================
  // STATES
  // =====================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantities, setQuantities] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // WISHLIST POPUP STATE

  const [wishlistDialog, setWishlistDialog] = useState({
    open: false,
    type: "success",
    product: null,
    message: "",
  });

  // =====================================
  // SNACKBAR HELPER
  // =====================================

  const showMessage = (message) => {
    setCartMessage(message);
    setSnackbarOpen(true);
  };

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
  // SEARCH DATA
  // =====================================

  const selectedFromSearch = location.state?.product;

  const searchTerm = (
    location.state?.searchTerm ||
    selectedFromSearch?.name ||
    ""
  )
    .trim()
    .toLowerCase();

  // =====================================
  // FETCH PRODUCT AND STOCK API
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProductsAndStocks = async () => {
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
          throw new Error(`Product API failed: HTTP ${productResponse.status}`);
        }

        const productResult = await productResponse.json();

        if (!productResult.success || !Array.isArray(productResult.data)) {
          throw new Error(productResult.message || "Product fetch failed.");
        }

        // STOCK API DATA

        let stockData = [];

        if (stockResponse.ok) {
          try {
            const stockResult = await stockResponse.json();

            if (stockResult.success && Array.isArray(stockResult.data)) {
              stockData = stockResult.data;
            }
          } catch (stockError) {
            console.warn("Stock API JSON Error:", stockError);
          }
        }

        // PRODUCT DATA

        const productData = productResult.data
          .filter(
            (item) => String(item.status || "").toLowerCase() === "active",
          )
          .map((item) => {
            const images = Array.isArray(item.images) ? item.images : [];

            const productSKU = normalizeSKU(item.sku);

            const matchingStock = productSKU
              ? stockData.find(
                  (stockItem) =>
                    normalizeSKU(stockItem.product_code) === productSKU,
                )
              : null;

            const availableStock = matchingStock
              ? getStockValue(matchingStock)
              : getStockValue(item);

            return {
              id: `product-${item.id}`,
              originalId: item.id,
              name: item.name || "Unnamed Product",
              sku: item.sku || "",
              category: item.category || "",
              price: Number(item.price) || 0,
              stock: availableStock,
              supplier: matchingStock?.supplier_name || item.supplier || "",
              description: item.description || "",
              image: images.length > 0 ? getImageUrl(images[0]) : cardimg1,
              images: images.map(getImageUrl),
              oldPrice: Number(item.oldPrice) || null,
              sizes: [],
              source: "product",
            };
          });

        // STOCK DATA

        const formattedStock = stockData.map((item) => ({
          id: `stock-${item.id}`,
          originalId: item.id,
          name: item.product_name || "Unnamed Product",
          sku: item.product_code || "",
          category: item.category_name || "",
          price: Number(item.unit_price) || 0,
          stock: getStockValue(item),
          supplier: item.supplier_name || "",
          description: "",
          image: getImageUrl(item.image_path),
          images: item.image_path ? [getImageUrl(item.image_path)] : [],
          oldPrice: null,
          sizes: [],
          source: "stock",
        }));

        // MERGE PRODUCT AND STOCK

        const allProducts = [...productData, ...formattedStock];

        if (!controller.signal.aborted) {
          setProducts(allProducts);

          setQuantities((previous) => {
            const updated = {};

            allProducts.forEach((product) => {
              const current = previous[product.id] || 1;

              updated[product.id] =
                product.stock > 0 ? Math.min(current, product.stock) : 1;
            });

            return updated;
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Product/Stock API Error:", err);
          setError(err.message || "Unable to load products and stocks.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProductsAndStocks();

    return () => controller.abort();
  }, []);

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        [
          product.name,
          product.category,
          product.description,
          product.sku,
          product.supplier,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm)),
      )
    : products;

  // =====================================
  // QUANTITY CHANGE
  // =====================================

  const changeQuantity = (id, amount) => {
    const product = products.find((item) => item.id === id);

    if (!product || product.stock <= 0) return;

    setQuantities((previous) => {
      const current = previous[id] || 1;

      return {
        ...previous,
        [id]: Math.max(1, Math.min(product.stock, current + amount)),
      };
    });
  };

  // =====================================
  // ADD TO CART + NOTIFICATION
  // =====================================

  const handleAddToCart = async (product) => {
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

    try {
      await createNotification({
        title: "Product Added to Cart",
        message: `${product.name} (${quantity} quantity) added to your cart successfully.`,
        type: "cart",
      });
    } catch (notificationError) {
      console.error("Cart Notification Error:", notificationError);
    }
  };

  // =====================================
  // WISHLIST + POPUP + NOTIFICATION
  // =====================================

  const toggleFavorite = async (product) => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // LOGIN CHECK

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

    const wishlistId = product.originalId;

    // CHECK EXISTING WISHLIST

    const alreadyFavorite = wishlistItems.some(
      (item) => String(item.id) === String(wishlistId),
    );

    let updatedWishlist;

    // REMOVE PRODUCT

    if (alreadyFavorite) {
      updatedWishlist = wishlistItems.filter(
        (item) => String(item.id) !== String(wishlistId),
      );

      showWishlistPopup(
        "removed",
        product,
        `${product.name} has been removed from your wishlist.`,
      );
    } else {
      // ADD PRODUCT

      updatedWishlist = [
        ...wishlistItems.filter(
          (item) => String(item.id) !== String(wishlistId),
        ),
        {
          ...product,
          id: wishlistId,
          stock: Number(product.stock),
          inStock: product.stock > 0,
        },
      ];

      showWishlistPopup(
        "success",
        product,
        `${product.name} has been added to your wishlist successfully!`,
      );
    }

    // UPDATE WISHLIST

    onWishlistChange(updatedWishlist);

    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlistUpdated"));

    // DATABASE NOTIFICATION

    try {
      await createNotification({
        title: alreadyFavorite
          ? "Product Removed from Wishlist"
          : "Product Added to Wishlist",

        message: alreadyFavorite
          ? `${product.name} has been removed from your wishlist.`
          : `${product.name} has been added to your wishlist.`,

        type: "wishlist",
      });
    } catch (notificationError) {
      console.error("Wishlist Notification Error:", notificationError);
    }
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return <div className="product-loading">Loading products and stock...</div>;
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
      <section className="view-products-section">
        {/* HEADER */}

        <div className="view-products-header">
          <div>
            <span className="view-products-eyebrow">OUR COLLECTION</span>

            <h2>{searchTerm ? "Search Results" : "All Products"}</h2>

            {searchTerm && (
              <p className="search-result-text">
                Results for "
                {location.state?.searchTerm || selectedFromSearch?.name}"
              </p>
            )}
          </div>

          <span className="products-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* PRODUCT GRID */}

        <div className="view-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isFavorite = wishlistItems.some(
                (item) => String(item.id) === String(product.originalId),
              );

              const quantity = quantities[product.id] || 1;

              return (
                <article className="view-product-card" key={product.id}>
                  {/* IMAGE */}

                  <div className="view-product-image">
                    <img
                      src={product.image || cardimg1}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cardimg1;
                      }}
                      onClick={() => setSelectedProduct(product)}
                    />

                    <span className="view-product-source">
                      {product.source === "stock" ? "Stock" : "Product"}
                    </span>

                    {/* DISCOUNT */}

                    {product.oldPrice > product.price && (
                      <span className="view-product-offer">
                        {Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100,
                        )}
                        % OFF
                      </span>
                    )}

                    {/* WISHLIST */}

                    <button
                      type="button"
                      className={`view-wishlist-btn ${
                        isFavorite ? "active" : ""
                      }`}
                      aria-label={
                        isFavorite ? "Remove from wishlist" : "Add to wishlist"
                      }
                      onClick={() => toggleFavorite(product)}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </button>
                  </div>

                  {/* CONTENT */}

                  <div className="view-product-content">
                    <span className="view-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="view-product-description">
                      {product.description || `Product code: ${product.sku}`}
                    </p>

                    {/* PRICE AND QUANTITY */}

                    <div className="view-product-footer">
                      <div className="view-price-wrapper">
                        <span className="view-product-price">
                          ₹{product.price.toFixed(2)}
                        </span>

                        {product.oldPrice > product.price && (
                          <span className="view-old-price">
                            ₹{product.oldPrice}
                          </span>
                        )}
                      </div>

                      {/* QUANTITY */}

                      <div
                        className="view-quantity-box"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1 || product.stock <= 0}
                          onClick={() => changeQuantity(product.id, -1)}
                        >
                          −
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={
                            product.stock <= 0 || quantity >= product.stock
                          }
                          onClick={() => changeQuantity(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="view-add-cart-btn"
                      disabled={product.stock <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}

                      <ShoppingCartIcon />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="no-products-found">
              <h3>No products found</h3>
              <p>Try searching with another product name or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          WISHLIST SUCCESS / REMOVE / LOGIN POPUP
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
          {/* POPUP ICON */}
          {/* 
          <div className={`wishlist-popup-icon ${wishlistDialog.type}`}>
            {wishlistDialog.type === "success" ? (
              <CheckCircleIcon />
            ) : (
              <FavoriteIcon />
            )}
          </div> */}

          {/* POPUP TITLE */}

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

          {/* MESSAGE */}

          <p className="wishlist-popup-message">{wishlistDialog.message}</p>

          {/* BUTTON */}

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

export default ViewProduct;
