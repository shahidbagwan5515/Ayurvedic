import React from "react";
import { NavLink } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import Login from "../Login/Login";
import "./MenuFooter.css";

function MenuFooter({ cartItems }) {
  const [loginOpen, setLoginOpen] = React.useState(false);

  return (
    <>
      <div className="mobile-menu-footer">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mobile-menu-item ${isActive ? "active-menu" : ""}`
          }
        >
          <HomeOutlinedIcon />
          <span>Home</span>
        </NavLink>

        {/* Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `mobile-menu-item menu-badge-item ${isActive ? "active-menu" : ""}`
          }
        >
          <div className="menu-icon-wrapper">
            <FavoriteBorderOutlinedIcon />
          </div>

          <span>Wishlist</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/MyCard"
          className={({ isActive }) =>
            `mobile-menu-item menu-badge-item ${isActive ? "active-menu" : ""}`
          }
        >
          <div className="menu-icon-wrapper">
            <ShoppingCartOutlinedIcon />

            <span className="menu-badge">{cartItems?.length || 0}</span>
          </div>

          <span>My Cart</span>
        </NavLink>

        {/* Login */}
        <button
          type="button"
          className="mobile-menu-item login-menu-button"
          onClick={() => setLoginOpen(true)}
        >
          <PersonOutlineOutlinedIcon />
          <span>Login</span>
        </button>
      </div>

      {/* Login Drawer */}
      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default MenuFooter;
