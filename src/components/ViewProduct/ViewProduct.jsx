import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ViewProduct.css";

import PrdInquary from "../DetailsCard/PrdInquary";
import cardimg1 from "../../assets/banner-1.jpeg";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL =
  "http://localhost/Admin-Panel/dashboard/Backend/api/product.php";

const STOCK_API_URL =
  "http://localhost/Admin-Panel/dashboard/Backend/api/stock.php";

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
// VIEW PRODUCT COMPONENT
// =====================================

function ViewProduct({ onAddToCart, wishlistItems = [], onWishlistChange }) {
  const location = useLocation();

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

  // =====================================
  // SEARCH DATA FROM HEADER
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
  // FETCH PRODUCT + STOCK API
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

        console.log("Product API Status:", productResponse.status);
        console.log("Stock API Status:", stockResponse.status);

        if (!productResponse.ok) {
          throw new Error(`Product API failed: HTTP ${productResponse.status}`);
        }

        if (!stockResponse.ok) {
          throw new Error(`Stock API failed: HTTP ${stockResponse.status}`);
        }

        const productResult = await productResponse.json();
        const stockResult = await stockResponse.json();

        console.log("Product API Data:", productResult);
        console.log("Stock API Data:", stockResult);

        if (!productResult.success) {
          throw new Error(productResult.message || "Product fetch failed.");
        }

        if (!stockResult.success) {
          throw new Error(stockResult.message || "Stock fetch failed.");
        }

        // PRODUCT DATA
        const productData = (productResult.data || [])
          .filter((item) => String(item.status).toLowerCase() === "active")
          .map((item) => {
            const images = Array.isArray(item.images) ? item.images : [];

            return {
              id: `product-${item.id}`,
              originalId: item.id,
              name: item.name || "",
              sku: item.sku || "",
              category: item.category || "",
              price: Number(item.price) || 0,
              stock: Math.max(0, Number(item.stock) || 0),
              supplier: item.supplier || "",
              description: item.description || "",
              image: getImageUrl(images[0]),
              images,
              oldPrice: null,
              sizes: [],
              source: "product",
            };
          });

        // STOCK DATA
        const stockData = (stockResult.data || []).map((item) => ({
          id: `stock-${item.id}`,
          originalId: item.id,
          name: item.product_name || "",
          sku: item.product_code || "",
          category: item.category_name || "",
          price: Number(item.unit_price) || 0,
          stock: Math.max(0, Number(item.quantity) || 0),
          supplier: item.supplier_name || "",
          description: "",
          image: getImageUrl(item.image_path),
          images: item.image_path ? [item.image_path] : [],
          oldPrice: null,
          sizes: [],
          source: "stock",
        }));

        // MERGE DATA
        const allProducts = [...productData, ...stockData];

        console.log("All Products:", allProducts);

        setProducts(allProducts);
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

      const updated = current + amount;

      return {
        ...previous,
        [id]: Math.max(1, Math.min(product.stock, updated)),
      };
    });
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = (product) => {
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
  // WISHLIST
  // =====================================

  const toggleFavorite = (product) => {
    if (typeof onWishlistChange !== "function") {
      setCartMessage("Wishlist functionality is not connected.");
      setSnackbarOpen(true);
      return;
    }

    const alreadyFavorite = wishlistItems.some(
      (item) => String(item.id) === String(product.id),
    );

    let updatedWishlist;

    if (alreadyFavorite) {
      updatedWishlist = wishlistItems.filter(
        (item) => String(item.id) !== String(product.id),
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
      alreadyFavorite
        ? `${product.name} removed from wishlist!`
        : `${product.name} added to wishlist!`,
    );

    setSnackbarOpen(true);
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
                (item) => String(item.id) === String(product.id),
              );

              const quantity = quantities[product.id] || 1;

              return (
                <article className="view-product-card" key={product.id}>
                  {/* PRODUCT IMAGE */}

                  <div className="view-product-image">
                    <img
                      src={product.image || cardimg1}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cardimg1;
                      }}
                      onClick={() => setSelectedProduct(product)}
                    />

                    {/* SOURCE LABEL */}

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
                      <FavoriteBorderIcon
                        sx={{
                          color: isFavorite ? "red" : "inherit",
                        }}
                      />
                    </button>
                  </div>

                  {/* PRODUCT CONTENT */}

                  <div className="view-product-content">
                    <span className="view-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="view-product-description">
                      {product.description || `Product code: ${product.sku}`}
                    </p>

                    {/* STOCK QUANTITY */}

                    <p className="view-product-stock">
                      {product.stock > 0
                        ? `Available Stock: ${product.stock}`
                        : "Out of Stock"}
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

export default ViewProduct;
