import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Heart, Package } from "lucide-react";
import { CartContext } from "../pages/CartContext";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (term) => {
    setSearchQuery(term);
    if (term) {
      navigate(`/?search=${term}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* 🛍️ Logo */}
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              🛍️ ShoeStore
            </Link>

            {/* 🔍 Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                placeholder="Search for shoes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* 🔗 Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-black font-medium transition-colors">
                Home
              </Link>

              {!user ? (
                <Link to="/login" className="text-gray-600 hover:text-black font-medium transition-colors">
                  Login
                </Link>
              ) : (
                <button onClick={logout} className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                  Logout
                </button>
              )}

              {user?.role === "admin" && (
                <Link to="/admin" className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">
                  Admin
                </Link>
              )}

              {user && (
                <>
                  <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-red-500" title="Wishlist">
                    <Heart size={20} />
                  </Link>
                  <Link to="/my-orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-blue-600" title="My Orders">
                    <Package size={20} />
                  </Link>
                </>
              )}

              {/* 🛒 Cart Icon */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <ShoppingCart size={24} className="text-gray-700 group-hover:text-black" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* 📱 Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart size={24} className="text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 📱 Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Home
                  </Link>

                  {!user ? (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg font-medium hover:text-red-600"
                    >
                      Logout
                    </button>
                  )}

                  {user && (
                    <>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Heart size={18} /> Wishlist
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Package size={18} /> My Orders
                      </Link>
                    </>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
