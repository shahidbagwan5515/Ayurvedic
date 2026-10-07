import React from "react";
import { NavLink } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import Login from "../Login/Login";
import "./MenuFooter.css";

function MenuFooter({ cartItems = [] }) {
  const [loginOpen, setLoginOpen] = React.useState(false);

  return (
    <>
      <nav className="mobile-menu-footer">
        {/* HOME */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mobile-menu-item ${isActive ? "active-menu" : ""}`
          }
        >
          <HomeOutlinedIcon />
          <span>Home</span>
        </NavLink>

        {/* WISHLIST */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `mobile-menu-item ${isActive ? "active-menu" : ""}`
          }
        >
          <FavoriteBorderOutlinedIcon />
          <span>Wishlist</span>
        </NavLink>

        {/* CART */}
        <NavLink
          to="/MyCard"
          className={({ isActive }) =>
            `mobile-menu-item ${isActive ? "active-menu" : ""}`
          }
        >
          <div className="menu-icon-wrapper">
            <ShoppingCartOutlinedIcon />

            {cartItems.length > 0 && (
              <span className="menu-badge">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            )}
          </div>

          <span>My Cart</span>
        </NavLink>

        {/* LOGIN */}
        <button
          type="button"
          className="mobile-menu-item login-menu-button"
          onClick={() => setLoginOpen(true)}
        >
          <PersonOutlineOutlinedIcon />
          <span>Login</span>
        </button>
      </nav>

      {/* LOGIN DRAWER */}
      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default MenuFooter;
