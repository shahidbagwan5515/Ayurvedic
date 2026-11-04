import { useState } from "react";
import "./PrdInquary.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function PrdInquary({ product, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0] || product.qty || "");

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      selectedSize: size,
    });

    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    onAddToCart({
      ...product,
      quantity,
      selectedSize: size,
    });

    alert("Product added successfully!");
  };

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={onBack}>
        <KeyboardBackspaceIcon /> Back
      </button>

      <div className="product-detail-card">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>

          <h2>{product.name}</h2>

          <p className="description">
            {product.description || "Traditional Ayurvedic herbal formulation."}
          </p>

          <div className="price">
            ₹{Number(product.price).toFixed(2)}
            {product.oldPrice && (
              <span>₹{Number(product.oldPrice).toFixed(2)}</span>
            )}
          </div>

          {(product.sizes?.length > 0 || product.qty) && (
            <div className="product-option">
              <label>Size</label>

              <div className="size-options">
                {(product.sizes || [product.qty]).map((item) => (
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

          <p className="stock">
            {product.stock ? "✓ In Stock" : "✕ Out of Stock"}
          </p>

          <button
            className="add-cart-dels"
            disabled={!product.stock}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button
            className="buy-now"
            disabled={!product.stock}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrdInquary;
