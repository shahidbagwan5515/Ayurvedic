import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ViewProduct.css";

import PrdInquary from "../DetailsCard/PrdInquary";

import cardimg1 from "../../assets/banner-1.jpeg";
import cardimg2 from "../../assets/nimbapatradi_churnam.jpg";
import cardimg3 from "../../assets/shop.jpeg";
import cardimg4 from "../../assets/psorakot.png";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const products = [
  {
    id: 1,
    image: cardimg1,
    category: "SKU FGC371",
    name: "Nimbapatradi Churnam",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 150,
    oldPrice: 240,
  },
  {
    id: 2,
    image: cardimg2,
    category: "SKIN CARE",
    name: "Vibha Sandal Cream",
    description:
      "A premium Ayurvedic cream enriched with natural sandalwood extracts for healthy skin.",
    price: 160,
    oldPrice: 250,
  },
  {
    id: 3,
    image: cardimg4,
    category: "AYURVEDIC SOAP",
    name: "Handmade Soap",
    description:
      "A traditional Ayurvedic herbal formulation made with natural ingredients.",
    price: 198,
    oldPrice: 299,
  },
  {
    id: 4,
    image: cardimg3,
    category: "SKIN CARE",
    name: "Vibha Hair Care Cream",
    description:
      "Carefully formulated for your everyday personal care routine.",
    price: 250,
    oldPrice: 299,
  },
  {
    id: 5,
    image: cardimg1,
    category: "SKU FGC371",
    name: "Nimbapatradi Churnam",
    description:
      "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
    price: 150,
    oldPrice: 240,
  },
  {
    id: 6,
    image: cardimg2,
    category: "SKIN CARE",
    name: "Vibha Sandal Cream",
    description:
      "A premium Ayurvedic cream enriched with natural sandalwood extracts.",
    price: 160,
    oldPrice: 250,
  },
  {
    id: 7,
    image: cardimg4,
    category: "AYURVEDIC SOAP",
    name: "Psorakot Handmade Soap",
    description:
      "A traditional Ayurvedic herbal formulation made with natural ingredients.",
    price: 198,
    oldPrice: 299,
  },
  {
    id: 8,
    image: cardimg3,
    category: "HAIR CARE",
    name: "Vibha Hair Care Cream",
    description:
      "A daily hair care product made for your personal care routine.",
    price: 250,
    oldPrice: 299,
  },
];

function ViewProduct({ onAddToCart, wishlistItems = [], onWishlistChange }) {
  const location = useLocation();

  // Header se search term receive hoga
  const searchTerm = (location.state?.searchTerm || "").trim().toLowerCase();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantities, setQuantities] = useState(
    Object.fromEntries(products.map((product) => [product.id, 1])),
  );

  // Product name, category aur description ke according search
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  });

  // Quantity change
  const changeQuantity = (id, amount) => {
    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) + amount),
    }));
  };

  // Add to cart
  const handleAddToCart = (product) => {
    if (typeof onAddToCart !== "function") return;

    onAddToCart({
      ...product,
      quantity: quantities[product.id] || 1,
    });
  };

  // Wishlist
  const favorites = wishlistItems.map((item) => item.id);

  const toggleFavorite = (product) => {
    if (typeof onWishlistChange !== "function") return;

    onWishlistChange((previous) => {
      const alreadyFavorite = previous.some((item) => item.id === product.id);

      if (alreadyFavorite) {
        return previous.filter((item) => item.id !== product.id);
      }

      return [...previous, { ...product, inStock: true }];
    });
  };

  return (
    <>
      {selectedProduct ? (
        <PrdInquary
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <section className="view-products-section">
          {/* Header */}
          <div className="view-products-header">
            <div>
              <span className="view-products-eyebrow">OUR COLLECTION</span>

              <h2>{searchTerm ? "Search Results" : "All Products"}</h2>

              {searchTerm && (
                <p className="search-result-text">
                  Results for "{location.state?.searchTerm}"
                </p>
              )}
            </div>

            <span className="products-count">
              {filteredProducts.length} Products
            </span>
          </div>

          {/* Products Grid */}
          <div className="view-products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const discount = Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100,
                );

                const isFavorite = favorites.includes(product.id);

                return (
                  <article
                    className="view-product-card"
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Product Image */}
                    <div className="view-product-image">
                      <img src={product.image} alt={product.name} />

                      <span className="view-product-offer">
                        {discount}% OFF
                      </span>

                      {/* Wishlist */}
                      <button
                        type="button"
                        className={`view-wishlist-btn ${
                          isFavorite ? "active" : ""
                        }`}
                        aria-label={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(product);
                        }}
                      >
                        <FavoriteBorderIcon
                          sx={{
                            color: isFavorite ? "red" : "inherit",
                          }}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="view-product-content">
                      <span className="view-product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p className="view-product-description">
                        {product.description}
                      </p>

                      {/* Price and Quantity */}
                      <div className="view-product-footer">
                        <div className="view-price-wrapper">
                          <span className="view-product-price">
                            ₹{product.price}
                          </span>

                          <span className="view-old-price">
                            ₹{product.oldPrice}
                          </span>
                        </div>

                        <div
                          className="view-quantity-box"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => changeQuantity(product.id, -1)}
                          >
                            −
                          </button>

                          <span>{quantities[product.id] || 1}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => changeQuantity(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        className="view-add-cart-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
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
      )}
    </>
  );
}

export default ViewProduct;
