import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import InputBase from "@mui/material/InputBase";

import Login from "../Login/Login";
import Companylog from "../../assets/AjitlabLogo.png";
import Companylog2 from "../../assets/navLog.png";

const menuItems = [
  { label: "Arishtas and Asavas", link: "/Category" },
  { label: "Churnams", link: "/churnams" },
  { label: "Ghrithams", link: "/ghrithms" },
  { label: "Immunity Boosters", link: "/immunity-boosters" },
  { label: "Kashayam", link: "/kashayam" },
  { label: "Lehams", link: "/lehams" },
  { label: "Rasakriyas", link: "/rasakriyas" },
  { label: "Patent and Proprietory", link: "/patent-and-proprietory" },
  { label: "Tailam", link: "/tailam" },
  { label: "Bhasmam Capsules", link: "/bhasmam-capsules" },
  { label: "New Generation Products", link: "/new-generation-products" },
  { label: "Non Prescription Medicines", link: "/non-prescription-medicines" },
  { label: "Bhasmas", link: "/bhasmas" },
  { label: "Kashayam Tablet", link: "/kashayam-tablet" },
  { label: "Gulikas", link: "/gulikas" },
  { label: "Softgel Capsules", link: "/softgel-capsules" },
  { label: "Personal Care Products", link: "/personal-care-products" },
  { label: "OTC/FMCG Products", link: "/otc-fmcg-products" },
  { label: "Pain Management", link: "/pain-management" },
  { label: "Baby Care", link: "/baby-care" },
  { label: "Skin Care Products", link: "/skin-care-products" },
  { label: "Eye Care", link: "/eye-care" },
  { label: "Offers", link: "/offers" },
  { label: "Hair Care Products", link: "/hair-care-products" },
  { label: "Female Health", link: "/female-health" },
  { label: "Male Health", link: "/male-health" },
  { label: "Karkidaka Chikitsa", link: "/karkidaka-chikitsa" },
  { label: "Daily Bite Gummies", link: "/daily-bite-gummies" },
  { label: "Publications", link: "/publications" },
];

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: -5px;
  }
`;

function Header({ cartItems = [], wishlistItems = [], products = [] }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const menuOpen = Boolean(anchorEl);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (!normalizedSearch) return false;

    const searchableText = [
      product.name,
      product.category,
      product.description,
      product.sku,
      ...(product.keywords || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectProduct = (product) => {
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    setSearchTerm(product.name);

    navigate("/ViewProduct", {
      state: {
        searchTerm: product.name,
        productId: product.id,
        product,
      },
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!normalizedSearch) return;

    if (filteredProducts.length > 0) {
      const index =
        activeSuggestion >= 0 && activeSuggestion < filteredProducts.length
          ? activeSuggestion
          : 0;

      selectProduct(filteredProducts[index]);
    } else {
      setShowSuggestions(true);
    }
  };

  const openShopMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeShopMenu = () => {
    setAnchorEl(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openLogin = () => {
    setDrawerOpen(false);
    setLoginOpen(true);
  };

  return (
    <>
      {/* TOP SUPPORT BAR */}
      <nav className="navbar-container">
        <div className="leftNav">
          <Link to="/" aria-label="Go to home">
            <img src={Companylog} alt="Ajit Labs" className="companyLog" />
          </Link>
        </div>

        <div className="rightNav">
          <a className="suport-center" href="tel:+91987654322">
            <div className="suport-icons">
              <HeadsetMicOutlinedIcon />
            </div>

            <div className="suport-content">
              <p>
                Support Center
                <br />
                <span>+91 987654322</span>
              </p>
            </div>
          </a>

          <Button
            variant="outlined"
            color="success"
            className="appointment-btn"
            onClick={() => navigate("/contact")}
          >
            <HealthAndSafetyIcon />
            Book an Appointment
          </Button>

          <div className="navRight-Img">
            <img src={Companylog2} alt="Ayurvedic store" />
          </div>
        </div>
      </nav>

      {/* MAIN NAVIGATION */}
      <AppBar position="static" className="main-appbar">
        <Toolbar className="header">
          {/* DESKTOP LEFT NAVIGATION */}
          <div className="header-left">
            <Button
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              onClick={openShopMenu}
              className="menu-btn"
              endIcon={<KeyboardArrowDownIcon />}
            >
              Shop Now
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeShopMenu}
              slotProps={{
                paper: { className: "shop-menu-paper" },
                list: { "aria-label": "Product categories" },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.link}
                  onClick={() => {
                    closeShopMenu();
                    navigate(item.link);
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            <Link to="/">Home</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/Blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/AboutUs">About</Link>
          </div>

          {/* SEARCH Input */}
          <div className="header-center">
            <form
              className="search-box"
              ref={searchRef}
              onSubmit={handleSearch}
              role="search"
            >
              <SearchIcon className="search-icon" />

              <InputBase
                placeholder="Search products, categories..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setShowSuggestions(false);
                    setActiveSuggestion(-1);
                  }

                  if (
                    event.key === "ArrowDown" &&
                    filteredProducts.length > 0
                  ) {
                    event.preventDefault();
                    setShowSuggestions(true);

                    setActiveSuggestion((previous) =>
                      previous < filteredProducts.length - 1 ? previous + 1 : 0,
                    );
                  }

                  if (event.key === "ArrowUp" && filteredProducts.length > 0) {
                    event.preventDefault();

                    setActiveSuggestion((previous) =>
                      previous > 0 ? previous - 1 : filteredProducts.length - 1,
                    );
                  }
                }}
                inputProps={{
                  "aria-label": "Search Ayurvedic products",
                  autoComplete: "off",
                }}
                fullWidth
              />

              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchTerm("");
                    setShowSuggestions(false);
                    setActiveSuggestion(-1);
                  }}
                >
                  ×
                </button>
              )}

              {showSuggestions && normalizedSearch && (
                <div className="search-suggestions">
                  <div className="search-dropdown-heading">
                    {filteredProducts.length > 0
                      ? "Searching Products"
                      : "Search Results"}
                  </div>

                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <button
                        type="button"
                        className={`search-suggestion-item ${
                          activeSuggestion === index ? "active" : ""
                        }`}
                        key={product.id}
                        onMouseEnter={() => setActiveSuggestion(index)}
                        onClick={() => selectProduct(product)}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="suggestion-product-image"
                          />
                        ) : (
                          <span className="suggestion-product-icon">
                            <SearchIcon />
                          </span>
                        )}

                        <span className="suggestion-product-info">
                          <strong>{product.name}</strong>
                          <small>
                            {product.category || product.sku || "Product"}
                          </small>
                        </span>

                        {product.price != null && (
                          <strong className="suggestion-price">
                            ₹{Number(product.price).toFixed(2)}
                          </strong>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="search-no-results">
                      <SearchIcon />
                      <strong>No products found</strong>
                      <span>Try another product name or category.</span>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="header-right">
            <div className="icons-left">
              <Link to="/Wishlist" className="header-action-link">
                <IconButton aria-label="Wishlist">
                  <FavoriteBorderIcon />
                  <CartBadge
                    badgeContent={wishlistItems.length}
                    color="error"
                    overlap="circular"
                    showZero={false}
                  />
                  <span>Wishlist</span>
                </IconButton>
              </Link>

              <Link to="/Mycard" className="header-action-link">
                <IconButton aria-label="My Cart">
                  <ShoppingCartIcon />
                  <CartBadge
                    badgeContent={cartItems.length}
                    color="error"
                    overlap="circular"
                    showZero={false}
                  />
                  <span>My Cart</span>
                </IconButton>
              </Link>

              <IconButton
                aria-label="Login"
                onClick={openLogin}
                className="login-action"
              >
                <PersonOutlinedIcon />
                <span>Login</span>
              </IconButton>
            </div>

            {/* MOBILE MENU BUTTON */}
            <Box className="sidebar-btn">
              <IconButton
                aria-label="Open mobile menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </div>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <Box className="mobile-drawer">
          <div className="drawer-header">
            <h3>Ayurvedic Store</h3>
            <IconButton onClick={closeDrawer} aria-label="Close mobile menu">
              ×
            </IconButton>
          </div>

          <Divider />

          <List className="mobile-menu-list">
            <ListItem
              component={Link}
              to="/"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <HomeOutlinedIcon />
              <span>Home</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/deals"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <LocalOfferOutlinedIcon />
              <span>Deals</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/Blog"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <ArticleOutlinedIcon />
              <span>Blog</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/contact"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <ContactSupportOutlinedIcon />
              <span>Contact Us</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/AboutUs"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <ContactSupportOutlinedIcon />
              <span>About Us</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/Wishlist"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <FavoriteBorderIcon />
              <span>Wishlist ({wishlistItems.length})</span>
            </ListItem>

            <ListItem
              component={Link}
              to="/Mycard"
              onClick={closeDrawer}
              className="mobile-link"
            >
              <ShoppingCartIcon />
              <span>My Cart ({cartItems.length})</span>
            </ListItem>

            <ListItem
              component="button"
              onClick={openLogin}
              className="mobile-link"
            >
              <PersonOutlinedIcon />
              <span>Login</span>
            </ListItem>
          </List>

          <Divider />

          <div className="mobile-categories">
            <h4>Shop by Category</h4>

            {menuItems.map((item) => (
              <Link key={item.link} to={item.link} onClick={closeDrawer}>
                {item.label}
              </Link>
            ))}
          </div>
        </Box>
      </Drawer>

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Header;
