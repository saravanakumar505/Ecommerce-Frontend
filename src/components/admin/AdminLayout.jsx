import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext"; // ✅ import AuthContext

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext); // ✅ use logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user + localStorage
    navigate("/login"); // redirect back to login
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ------------------------- SIDEBAR --------------------------- */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0f1a2a] text-white shadow-xl z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Admin Panel</h1>

          {/* Close button mobile only */}
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-4 py-6 space-y-4">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
          >
            <Package size={20} /> Products
          </Link>

          <Link
            to="/admin/add-product"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
          >
            <PlusCircle size={20} /> Add Product
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800"
          >
            <ClipboardList size={20} /> Orders
          </Link>

          {/* 🚪 Logout inside sidebar for convenience */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 mt-8 text-left"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* ------------------------- MAIN CONTENT --------------------------- */}
      <div className="flex-1 flex flex-col md:ml-64 ml-0 transition-all duration-300">
        {/* Top Navbar */}
        <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3">
          {/* Menu Button (Mobile) */}
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>

          <h2 className="text-xl font-semibold">Dashboard</h2>

          {/* Logout (Top right button) */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* ------------------------- PAGE CONTENT --------------------------- */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
