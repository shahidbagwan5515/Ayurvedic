import { useState } from "react";
import "./ProductCard.css";
import PrdInquary from "../DetailsCard/PrdInquary";

import cardimg1 from "../../assets/banner-1.jpeg";
import cardimg2 from "../../assets/nimbapatradi_churnam.jpg";
import cardimg3 from "../../assets/shop.jpeg";
import cardimg4 from "../../assets/psorakot.png";

function ProductCard({ onAddToCart }) {
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
      name: "Psorakot Ayurvedic Handmade Soap",
      description:
        "A traditional Ayurvedic herbal formulation made with carefully selected natural ingredients.",
      price: 198,
      oldPrice: 299,
      sizes: ["75g", "100g"],
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {}),
  );

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  // Buy Now
  const handleBuyNow = (product) => {
    const quantity = quantities[product.id];

    const confirmBuy = window.confirm(
      `Do you want to buy ${product.name}?\n\nPrice: ₹${product.price}\nQuantity: ${quantity}`,
    );

    if (confirmBuy) {
      const productToCart = {
        ...product,
        quantity: quantity,
        selectedSize: product.sizes[0],
      };

      onAddToCart(productToCart);

      alert("Product added successfully!");
    }
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
    <section className="prdcard-section">
      {products.map((product) => (
        <div
          className="product-card"
          key={product.id}
          onClick={() => setSelectedProduct(product)}
        >
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-content">
            <span className="product-category">{product.category}</span>

            <h3>{product.name}</h3>

            <p className="product-description">{product.description}</p>

            <div className="qntPrice-box">
              <div className="price-wrapper">
                <span className="product-price">₹{product.price}</span>

                <span className="old-price">₹{product.oldPrice}</span>
              </div>

              <div
                className="quantity-box"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => decreaseQty(product.id)}>−</button>

                <span>{quantities[product.id]}</span>

                <button onClick={() => increaseQty(product.id)}>+</button>
              </div>
            </div>

            <div
              className="product-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="add-cart-btn">Add to Cart</button>

              <button
                className="buy-now-btn"
                onClick={() => handleBuyNow(product)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ProductCard;
