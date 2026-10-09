import { useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Remove product
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((product) => product.id !== id));
  };
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header cartItems={cartItems} />

      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart} />} />
        <Route path="/Home" element={<Home onAddToCart={addToCart} />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/deals" element={<Deals onAddToCart={addToCart} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Blog" element={<Blog />} />

        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/wishlist" element={<h1>WishList</h1>} />
        <Route path="/CardEmp" element={<CardEmp />} />
        <Route path="/Category" element={<Category />} />

        <Route
          path="/Mycard"
          element={<MyCard cartItems={cartItems} onRemove={removeFromCart} />}
        />
        <Route path="/Footer" element={<Footer />} />
        <Route
          path="/MenuFooter"
          element={<MenuFooter cartItems={cartItems} />}
        />
      </Routes>
      <Footer />
      <MenuFooter cartItems={cartItems} />
    </BrowserRouter>
  );
}

export default App;
