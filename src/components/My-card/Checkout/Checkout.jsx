import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";
import CardEmp from "../CardEmp";

function Checkout({
  cartItems = [],
  onRemove,
  onUpdateQuantity,
  onPlaceOrder,
}) {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState("");

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Always use actual products received from My Cart.
  const products = cartItems;

  // Calculate subtotal.
  const subtotal = products.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  // Calculate discount, GST and grand total.
  const validDiscount = Math.min(discount, subtotal);
  const taxableAmount = Math.max(0, subtotal - validDiscount);
  const deliveryAmount = 0;
  const gst = taxableAmount * 0.05;

  const grandTotal = taxableAmount + deliveryAmount + gst;

  const handlePlaceOrder = () => {
    if (products.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!deliveryAddress || !billingAddress) {
      alert("Please add both delivery and billing addresses.");
      return;
    }

    navigate("/Payment", {
      state: {
        products,
        deliveryAddress,
        billingAddress,
        subtotal,
        discount: validDiscount,
        deliveryAmount,
        gst,
        grandTotal,
      },
    });
  };

  // Reset discount if cart subtotal changes.
  useEffect(() => {
    if (isDiscountApplied) {
      const newDiscount = subtotal * 0.1;
      setDiscount(newDiscount);

      if (subtotal <= 0) {
        setDiscount(0);
        setIsDiscountApplied(false);
        setMessage("");
      }
    }
  }, [subtotal, isDiscountApplied]);

  // Format price in Indian currency.
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Update product quantity in the shared App cart state.
  const updateQuantity = (id, amount) => {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    const currentQuantity = Number(product.quantity) || 1;
    const newQuantity = currentQuantity + amount;

    if (newQuantity < 1) return;

    onUpdateQuantity?.(id, newQuantity);
  };

  // Remove product from the shared cart.
  const removeProduct = (id) => {
    onRemove?.(id);
    setMessage("");
  };

  // Apply coupon.
  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();

    if (products.length === 0) {
      setDiscount(0);
      setIsDiscountApplied(false);
      setMessage("Your cart is empty.");
      return;
    }

    if (code === "AYUR10") {
      setDiscount(subtotal * 0.1);
      setIsDiscountApplied(true);
      setMessage("Discount code applied successfully!");
    } else {
      setDiscount(0);
      setIsDiscountApplied(false);
      setMessage("Invalid discount code. Try AYUR10.");
    }
  };

  // Open delivery or billing address form.
  const openAddressForm = (type) => {
    const existingAddress =
      type === "delivery" ? deliveryAddress : billingAddress;

    setShowAddressForm(type);

    setAddressForm(
      existingAddress
        ? { ...existingAddress }
        : {
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
          },
    );
  };

  // Save address.
  const saveAddress = (event) => {
    event.preventDefault();

    const savedAddress = { ...addressForm };

    if (showAddressForm === "delivery") {
      setDeliveryAddress(savedAddress);
    } else if (showAddressForm === "billing") {
      setBillingAddress(savedAddress);
    }

    setShowAddressForm("");
  };

  // Place order validation.
  // const handlePlaceOrder = () => {
  //   if (products.length === 0) {
  //     alert("Your cart is empty.");
  //     return;
  //   }

  //   if (!deliveryAddress || !billingAddress) {
  //     alert("Please add both delivery and billing addresses.");
  //     return;
  //   }

  //   // Connect your backend order/payment API here.
  //   alert(
  //     "Checkout details are ready. Connect your order API to place the order.",
  //   );
  // };

  // Empty cart.
  if (products.length === 0) {
    return (
      <div className="mycard-empty">
        <CardEmp />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="checkout-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>Checkout</span>
      </div>

      <div className="checkout-layout">
        {/* Left section */}
        <div className="checkout-left">
          {/* User information */}
          <section className="checkout-user-card">
            <div className="checkout-avatar">U</div>

            <div className="checkout-user-info">
              <h3>Customer</h3>
              <p>Enter your delivery details below.</p>
            </div>

            <Link to="/Wishlist" className="checkout-change-link">
              My Account
            </Link>
          </section>

          {/* Delivery address */}
          <section className="checkout-address-card">
            <h2>Delivery Address</h2>

            {deliveryAddress ? (
              <div className="checkout-saved-address">
                <strong>{deliveryAddress.name}</strong>
                <p>{deliveryAddress.phone}</p>
                <p>{deliveryAddress.address}</p>
                <p>
                  {deliveryAddress.city}, {deliveryAddress.state} -{" "}
                  {deliveryAddress.pincode}
                </p>

                <button
                  type="button"
                  className="checkout-text-btn"
                  onClick={() => openAddressForm("delivery")}
                >
                  Change Address
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="checkout-add-address"
                onClick={() => openAddressForm("delivery")}
              >
                + Add Delivery Address
              </button>
            )}

            {showAddressForm === "delivery" && (
              <form onSubmit={saveAddress} className="checkout-address-form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressForm.name}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, name: e.target.value })
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                />

                <textarea
                  placeholder="Full Address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  required
                />

                <div className="checkout-form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Pincode"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pincode: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                />

                <div className="checkout-form-actions">
                  <button type="submit" className="checkout-save-btn">
                    Save Address
                  </button>

                  <button
                    type="button"
                    className="checkout-cancel-btn"
                    onClick={() => setShowAddressForm("")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Billing address */}
          <section className="checkout-address-card">
            <h2>Billing Address</h2>

            {billingAddress ? (
              <div className="checkout-saved-address">
                <strong>{billingAddress.name}</strong>
                <p>{billingAddress.phone}</p>
                <p>{billingAddress.address}</p>
                <p>
                  {billingAddress.city}, {billingAddress.state} -{" "}
                  {billingAddress.pincode}
                </p>

                <button
                  type="button"
                  className="checkout-text-btn"
                  onClick={() => openAddressForm("billing")}
                >
                  Change Address
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="checkout-add-address"
                onClick={() => openAddressForm("billing")}
              >
                + Add Billing Address
              </button>
            )}

            {showAddressForm === "billing" && (
              <form onSubmit={saveAddress} className="checkout-address-form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressForm.name}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, name: e.target.value })
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                />

                <textarea
                  placeholder="Full Address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  required
                />

                <div className="checkout-form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Pincode"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pincode: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                />

                <div className="checkout-form-actions">
                  <button type="submit" className="checkout-save-btn">
                    Save Address
                  </button>

                  <button
                    type="button"
                    className="checkout-cancel-btn"
                    onClick={() => setShowAddressForm("")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Right section */}
        <aside className="checkout-right">
          <section className="checkout-summary-card">
            {/* Coupon */}
            <h3>Apply Discount Code</h3>

            <div className="checkout-coupon-row">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);

                  if (isDiscountApplied) {
                    setDiscount(0);
                    setIsDiscountApplied(false);
                  }

                  setMessage("");
                }}
              />

              <button type="button" onClick={applyDiscount}>
                Apply
              </button>
            </div>

            {message && (
              <p
                className={
                  message.includes("successfully")
                    ? "checkout-message success"
                    : "checkout-message error"
                }
              >
                {message}
              </p>
            )}

            <p className="coupon-hint">
              Use <strong>AYUR10</strong> for 10% off.
            </p>

            <div className="checkout-divider" />

            {/* Order summary */}
            <h3 className="checkout-summary-title">
              Order Summary ({products.length} products)
            </h3>

            <div className="checkout-products">
              {products.map((product) => {
                const price = Number(product.price) || 0;
                const quantity = Number(product.quantity) || 1;
                const productName = product.name || product.title || "Product";
                const productImage = product.image || product.img;

                return (
                  <article
                    className="checkout-product"
                    key={`${product.id}-${product.size || ""}`}
                  >
                    <div className="checkout-product-image">
                      {productImage && (
                        <img
                          src={productImage}
                          alt={productName}
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      )}
                    </div>

                    <div className="checkout-product-info">
                      <h4>{productName}</h4>

                      {product.category && <p>{product.category}</p>}

                      {product.size && <p>Size: {product.size}</p>}

                      <div className="checkout-product-price">
                        <strong>{formatPrice(price * quantity)}</strong>

                        <span className="checkout-stock">
                          {product.inStock === false
                            ? "Out of Stock"
                            : "In Stock"}
                        </span>
                      </div>

                      <div className="checkout-product-meta">
                        <span>Price: {formatPrice(price)}</span>
                        {product.sku && <span>SKU {product.sku}</span>}
                      </div>

                      <div className="checkout-product-actions">
                        <div className="checkout-quantity">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="checkout-remove-btn"
                          onClick={() => removeProduct(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="checkout-divider" />

            {/* Price details */}
            <h3 className="checkout-price-title">Price Details</h3>

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {validDiscount > 0 && (
              <div className="checkout-price-row checkout-discount-row">
                <span>Discount (10%)</span>
                <span>-{formatPrice(validDiscount)}</span>
              </div>
            )}

            <div className="checkout-price-row">
              <span>Delivery Amount</span>
              <span>{formatPrice(deliveryAmount)}</span>
            </div>

            <div className="checkout-price-row">
              <span>GST (5%)</span>
              <span>{formatPrice(gst)}</span>
            </div>

            <div className="checkout-divider" />

            {/* Grand total */}
            <div className="checkout-grand-total">
              <span>Grand Total</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>

            <button
              type="button"
              className="checkout-place-order"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

            <p className="checkout-shipping-note">
              Free Shipping on orders above ₹2000
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
