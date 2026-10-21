import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import MyCard from "./components/My-card/MyCard";
import Footer from "./components/Footer/Footer";
import MenuFooter from "./components/Menufooter/MenuFooter";
import Login from "./components/Login/Login";
import Deals from "./components/Deals/Deals";
import CardEmp from "./components/My-card/CardEmp";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Contact from "./components/Contact/Contact";
import Category from "./components/ShopNow/Category";
import Blog from "./components/Blog/Blog";
import BlogDetails from "./components/Blog/BlogDetails";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import AboutUs from "./components/About Us/AboutUs";
import Wishlist from "./components/Wishlist/Wishlist";
import Checkout from "./components/My-card/Checkout/Checkout";
import OrderHistory from "./components/Wishlist/OrderHistory/OrderHistory";
import Payment from "./components/Payment/Payment";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (product) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 1) +
                  (Number(product.quantity) || 1),
              }
            : item,
        );
      }

      return [
        ...previous,
        {
          ...product,
          quantity: Number(product.quantity) || 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((previous) => previous.filter((product) => product.id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
          : item,
      ),
    );
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Processing",
      payment: "Paid",
      total: orderData.total,
      products: orderData.products.map((product) => ({
        ...product,
        quantity: Number(product.quantity) || 1,
        price: Number(product.price) || 0,
      })),
    };

    setOrders((previous) => [newOrder, ...previous]);
    setCartItems([]);
  };
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header cartItems={cartItems} wishlistItems={wishlistItems} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={setWishlistItems}
            />
          }
        />

        <Route
          path="/Home"
          element={
            <Home
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={setWishlistItems}
            />
          }
        />

        <Route path="/Login" element={<Login />} />

        <Route path="/deals" element={<Deals onAddToCart={addToCart} />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />

        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/CardEmp" element={<CardEmp />} />
        <Route path="/Category" element={<Category />} />

        <Route
          path="/Wishlist"
          element={
            <Wishlist
              wishlistItems={wishlistItems}
              onWishlistChange={setWishlistItems}
              onAddToCart={addToCart}
              orders={orders}
            />
          }
        />
        <Route
          path="/ViewProduct"
          element={
            <ViewProduct
              onAddToCart={addToCart}
              wishlistItems={wishlistItems}
              onWishlistChange={setWishlistItems}
            />
          }
        />

        <Route
          path="/OrderHistory"
          element={<OrderHistory orders={orders} />}
        />

        <Route
          path="/Mycard"
          element={
            <MyCard
              cartItems={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
            />
          }
        />

        <Route
          path="/Checkout"
          element={
            <Checkout
              cartItems={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onPlaceOrder={placeOrder}
            />
          }
        />
        <Route
          path="/Payment"
          element={<Payment onPlaceOrder={placeOrder} />}
        />

        <Route path="/Footer" element={<Footer />} />

        <Route
          path="/MenuFooter"
          element={
            <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
          }
        />

        <Route path="/about" element={<h1>About Us</h1>} />
        <Route path="/privacy-policy" element={<h1>Privacy Policy</h1>} />

        <Route
          path="/delivery-shipping"
          element={<h1>Delivery &amp; Shipping</h1>}
        />

        <Route path="/terms" element={<h1>Terms &amp; Conditions</h1>} />
        <Route path="/refund-policy" element={<h1>Refund Policy</h1>} />
        <Route path="/publications" element={<h1>Publications</h1>} />
      </Routes>
      <Footer />
      <MenuFooter cartItems={cartItems} wishlistItems={wishlistItems} />
    </BrowserRouter>
  );
}

export default App;
