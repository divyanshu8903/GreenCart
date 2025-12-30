import React from "react";
import Navbar from "./components/uilayouts/Navbar";
import HomPage from "./pages/HomPage";
import { Route, Routes, useLocation } from "react-router-dom";

import {Toaster} from 'react-hot-toast'
import Footer from "./components/uilayouts/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/forms/Login";
import AllProducts from "./pages/AllProducts";
import ProductsCategory from "./pages/ProductsCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/forms/Seller/SellerLogin";
import SellerDashboardWithNavbar from "./components/uilayouts/Seller/SellerDashboardWithNavbar";
import AddProduct from "./pages/Seller/AddProduct";
import ProductList from "./pages/Seller/ProductList";
import Orders from "./pages/Seller/Orders";
import axios from "axios";
import Loading from "./components/uilayouts/Loading";


const App = () => {
  axios.defaults.withCredentials = true;
  const isSellerPath = useLocation().pathname.includes("seller")
  const {showUserLogin, isSeller} = useAppContext()

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null :<Navbar />}
      {showUserLogin ? <Login/> : null}
      <Toaster/>
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<HomPage />} />
          <Route path="/products" element={<AllProducts/>} />
          <Route path="/products/:category" element={<ProductsCategory/>} />
          <Route path="/products/:category/:id" element={<ProductDetails/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/add-address" element={<AddAddress/>} />
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/loader" element={<Loading/>} />
      

          <Route path="/seller" element={isSeller ? <SellerDashboardWithNavbar/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null}/>
            <Route path="product-list" element={isSeller ? <ProductList/> : null}/>
            <Route path="orders" element={isSeller ? <Orders/> : null}/>
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer/>}
    </div>
  );
};

export default App;
