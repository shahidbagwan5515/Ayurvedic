import React from "react";
import "./CardEmp.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { Link } from "react-router-dom";
function CardEmp() {
  return (
    <div className="cart-container">
      <h2>My Cart</h2>

      <div className="empty-cart">
        <ShoppingCartOutlinedIcon className="cart-icon" />

        <h3>Your Cart is Empty</h3>

        <p>Add items to your cart to proceed with the purchase</p>

        <Link to="/Home" className="shopping-btn">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default CardEmp;
