import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/productDetails";
import Icon from "./components/icon";
import BrandProducts from "./pages/BrandProducts";
import Checkout from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";

// Admin Components
import ProductList from "./components/admin/ProductList";
import AddProduct from "./components/admin/AddProduct";
import OrderList from "./components/admin/OrderList";
import OrderDetails from "./components/admin/OrderDetails";
import EditProduct from "./components/admin/EditProduct";
import Dashboard from "./components/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/auth/AdminRoute";
import { Toaster } from 'react-hot-toast';
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isAdminPage = location.pathname.startsWith("/admin");

  // ✅ Redirect admin after login
  useEffect(() => {
    if (user?.isAdmin && location.pathname === "/login") {
      navigate("/admin"); // ✅ fixed: redirect to existing route
    }
  }, [user, location.pathname, navigate]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {/* ✅ Show Navbar only for user-facing pages */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* 🏠 Home */}
        <Route
          path="/"
          element={
            <>
              <Icon />
              <Home />
              <ProductCard />
            </>
          }
        />

        {/* 👤 Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛒 Cart & Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* payment page route */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* ❤️ Wishlist & 📦 Orders */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />


        {/* 👟 Product Pages */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/brand/:brandName" element={<BrandProducts />} />

        {/* ⚙️ ADMIN ROUTES — PROTECTED */}
        <Route element={<AdminRoute />}>
          {/* ✅ Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />

          {/* ✅ Also allow /admin/dashboard URL */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <ProductList />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/add-product"
            element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <OrderList />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/orders/:id"
            element={
              <AdminLayout>
                <OrderDetails />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            }
          />
        </Route>

        {/* 🚫 Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ Footer visible only on user pages */}
      {!isAdminPage && <Footer />}
    </>
  );
};

export default App;
