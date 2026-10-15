import { useState } from "react";
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

function ViewProduct({ onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState(
    Object.fromEntries(products.map((product) => [product.id, 1])),
  );

  const [favorites, setFavorites] = useState([]);

  const changeQuantity = (id, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + amount),
    }));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        quantity: product.quantity ?? quantities[product.id] ?? 1,
      });
    }
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
          <div className="view-products-header">
            <div>
              <span className="view-products-eyebrow">OUR COLLECTION</span>
              <h2>All Products</h2>
            </div>

            <span className="products-count">{products.length} Products</span>
          </div>

          <div className="view-products-grid">
            {products.map((product) => {
              const discount = Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              );

              return (
                <article
                  className="view-product-card"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="view-product-image">
                    <img src={product.image} alt={product.name} />

                    <span className="view-product-offer">{discount}% OFF</span>

                    <button
                      className={`view-wishlist-btn ${
                        favorites.includes(product.id) ? "active" : ""
                      }`}
                      aria-label="Add to wishlist"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <FavoriteBorderIcon />
                    </button>
                  </div>

                  <div className="view-product-content">
                    <span className="view-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="view-product-description">
                      {product.description}
                    </p>

                    <div className="view-product-footer">
                      <div className="view-price-wrapper">
                        <span className="view-product-price">
                          ₹{product.price}
                        </span>
                        <span className="view-old-price">
                          ₹{product.oldPrice}
                        </span>
                      </div>

                      <div className="view-quantity-box">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => changeQuantity(product.id, -1)}
                        >
                          −
                        </button>

                        <span>{quantities[product.id]}</span>

                        <button
                          aria-label="Increase quantity"
                          onClick={() => changeQuantity(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="view-add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                      <ShoppingCartIcon />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

export default ViewProduct;
