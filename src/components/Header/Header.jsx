import * as React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Login from "../Login/Login";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
function Header({ cartItems }) {
  const id = React.useId();

  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [loginOpen, setLoginOpen] = React.useState(false);

  const menuOpen = Boolean(anchorEl);

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const menuItems = [
    { label: "Arishtas and Asavas", link: "/Category " },
    { label: "Churnams", link: "/churnams" },
    { label: "Ghrithms", link: "/ghrithms" },
    { label: "Immunity Boosters", link: "/immunity-boosters" },

    { label: "Kashayam", link: "/kashayam" },
    { label: "Lehams", link: "/lehams" },
    { label: "Rasakriyas", link: "/rasakriyas" },
    {
      label: "Patent and Proprietory",
      link: "/patent-and-proprietory",
    },

    { label: "Tailam", link: "/tailam" },
    { label: "Bhasmam Capsules", link: "/bhasmam-capsules" },
    {
      label: "New Generation Products",
      link: "/new-generation-products",
    },
    {
      label: "Non Prescription Medicines",
      link: "/non-prescription-medicines",
    },

    { label: "Bhasmas", link: "/bhasmas" },
    { label: "Kashayam Tablet", link: "/kashayam-tablet" },
    { label: "Gulikas", link: "/gulikas" },
    { label: "Softgel Capsules", link: "/softgel-capsules" },

    {
      label: "Personal Care Products",
      link: "/personal-care-products",
    },
    { label: "OTC/FMCG Products", link: "/otc-fmcg-products" },
    { label: "Pain Management", link: "/pain-management" },
    { label: "Baby care", link: "/baby-care" },

    { label: "Skin Care Products", link: "/skin-care-products" },
    { label: "Eye Care", link: "/eye-care" },
    { label: "Offers", link: "/offers" },
    { label: "Hair care products", link: "/hair-care-products" },

    { label: "Female Health", link: "/female-health" },
    { label: "Male Health", link: "/male-health" },
    { label: "Karkidaka Chikitsa", link: "/karkidaka-chikitsa" },
    { label: "Daily Bite Gummies", link: "/daily-bite-gummies" },

    { label: "Publications", link: "/publications" },
  ];

  return (
    <>
      <nav className="navbar-container">
        <div className="leftNav">
          <Link to="/Home">
            {" "}
            <h2>Wellcome to Ayurveda</h2>
          </Link>
        </div>

        <div className="rightNav">
          <div className="suport-center">
            <div className="suport-icons">
              <HeadsetMicOutlinedIcon />
            </div>

            <div className="suport-content">
              <p>
                Support Center <br />
                {}
                <span>91+ 987654322</span>
              </p>
            </div>
          </div>
          <Button variant="outlined" color="success">
            Book an Appointment
          </Button>
        </div>
      </nav>
      <AppBar position="static">
        <Toolbar className="header">
          {/* =========================
              LEFT
          ========================= */}

          <div className="header-left">
            <Button
              id={buttonId}
              aria-controls={menuOpen ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              onClick={handleClick}
              className="menu-btn"
              endIcon={<KeyboardArrowDownIcon />}
            >
              Shop Now
            </Button>

            {/* Desktop Shop Menu */}
            <Menu
              id={menuId}
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": buttonId,
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem key={item.link} onClick={handleClose}>
                  <Link to={item.link}>{item.label}</Link>
                </MenuItem>
              ))}
            </Menu>
            <Link to="/">Home</Link>
            <Link to="/deals">Deals</Link>

            <Link to="/contact">Contact Us</Link>
            <Link to="/Blog">Blog</Link>
          </div>

          {/* =========================
              SEARCH
          ========================= */}

          <div className="header-center">
            <div className="search-box">
              <SearchIcon className="search-icon" />

              <InputBase
                placeholder="Search for what you want..."
                inputProps={{
                  "aria-label": "search",
                }}
              />
            </div>
          </div>

          {/* =========================
              RIGHT
          ========================= */}

          <div className="header-right">
            <div className="icons-left">
              {/* Wishlist */}
              <IconButton aria-label="wishlist">
                <FavoriteBorderIcon fontSize="small" />

                <CartBadge badgeContent={1} color="error" overlap="circular" />

                <span>Wishlist</span>
              </IconButton>

              {/* Cart */}
              <Link to="/Mycard">
                <IconButton aria-label="cart">
                  <ShoppingCartIcon fontSize="small" />

                  <CartBadge
                    badgeContent={cartItems.length}
                    color="error"
                    overlap="circular"
                  />

                  <span>My Cart</span>
                </IconButton>
              </Link>

              {/* Login */}
              <ListItem>
                <IconButton
                  aria-label="login"
                  onClick={() => {
                    setDrawerOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  <PersonOutlinedIcon fontSize="small" />
                  <span>Login</span>
                </IconButton>
              </ListItem>
            </div>

            {/* Mobile Menu Button */}
            <Box className="sidebar-btn">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </div>
        </Toolbar>
      </AppBar>

      {/* =========================
          MOBILE DRAWER
      ========================= */}

      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box className="mobile-drawer" role="presentation">
          <div className="drawer-header">
            <h3>Ayurvedic </h3>

            <IconButton onClick={toggleDrawer(false)} aria-label="close menu">
              ✕
            </IconButton>
          </div>

          <Divider />

          <List className="mobile-menu-list">
            {/* Home */}
            <ListItem component={Link} to="/Home" onClick={toggleDrawer(false)}>
              <HomeOutlinedIcon />
              <span>Home</span>
            </ListItem>

            {/* Deals */}
            <ListItem
              component={Link}
              to="/deals"
              onClick={toggleDrawer(false)}
            >
              <LocalOfferOutlinedIcon />
              <span>Deals</span>
            </ListItem>

            {/* Contact Us */}
            <ListItem
              component={Link}
              to="/Contact"
              onClick={toggleDrawer(false)}
            >
              <ContactSupportOutlinedIcon />
              <span>Contact Us</span>
            </ListItem>

            {/*Blog */}
            <ListItem component={Link} to="/Blog" onClick={toggleDrawer(false)}>
              <ArticleOutlinedIcon />
              <span>Blog</span>
            </ListItem>

            {/* Wishlist */}
            <ListItem>
              <IconButton
                component={Link}
                to="/wishlist"
                onClick={toggleDrawer(false)}
              >
                <FavoriteBorderIcon />
                <span>Wishlist</span>
              </IconButton>
            </ListItem>

            {/* Cart */}
            <ListItem>
              <IconButton
                component={Link}
                to="/Mycard"
                onClick={toggleDrawer(false)}
              >
                <ShoppingCartIcon fontSize="small" />
                <span>My Cart</span>
              </IconButton>
            </ListItem>

            {/* Login */}
            <ListItem>
              <IconButton
                aria-label="login"
                onClick={() => {
                  setDrawerOpen(false);
                  setLoginOpen(true);
                }}
              >
                <PersonOutlinedIcon fontSize="small" />
                <span>Login</span>
              </IconButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Header;
