import CardEmp from "./CardEmp";
import "./Mycard.css";

function MyCard({ cartItems, onRemove }) {
  const totalPrice = cartItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const handleRemove = (product) => {
    const confirmRemove = window.confirm(
      `Remove "${product.name}" from your cart?`,
    );

    if (confirmRemove) {
      onRemove(product.id);
    }
  };

  return (
    <>
      <div className="mycard-container">
        {cartItems.length === 0 ? (
          <CardEmp />
        ) : (
          <>
            {cartItems.map((product) => (
              <div className="mycard-box" key={product.id}>
                <div className="topImg">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="mycard-conten">
                  <div className="describ-box">
                    <h3>{product.name}</h3>

                    <p>{product.description}</p>

                    <p>
                      Quantity: <span>{product.quantity}</span>
                    </p>

                    <p>
                      Size: <span>{product.selectedSize}</span>
                    </p>

                    <div className="price-cd">
                      <p>
                        Rs. <span>{product.price * product.quantity}</span>
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="remove-cart-btn"
                      onClick={() => handleRemove(product)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="cart-total">
        <h2>Total Price: ₹{totalPrice}</h2>
      </div>
    </>
  );
}

export default MyCard;
