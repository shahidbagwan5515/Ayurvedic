import { useState } from "react";
import "./PrdInquary.css";

function PrdInquary({ product, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0] || "");

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="product-detail-card">
        {/* Product Image */}
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Product Details */}
        <div className="product-info">
          <span className="product-category">{product.category}</span>

          <h2>{product.name}</h2>

          <p className="description">{product.description}</p>

          <div className="price">
            ₹{product.price}
            <span>₹{product.oldPrice}</span>
          </div>

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="product-option">
              <label>Size</label>

              <div className="size-options">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    className={size === item ? "active" : ""}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="product-option">
            <label>Quantity</label>

            <div className="quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <p className="stock">✓ In Stock</p>

          <button className="add-cart">Add to Cart</button>

          <button className="buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default PrdInquary;
