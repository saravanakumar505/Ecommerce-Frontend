import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 font-poppins mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- Brand Section --- */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">🛍️ ShoeStore</h2>
          <p className="text-gray-400 leading-relaxed">
            Discover the latest styles from top brands like Nike, Adidas, Puma, and more.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-white transition">
                Checkout
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Social Links --- */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-5 text-2xl">
            <a
              href="https://www.instagram.com/__saravana__._?igsh=dDJ3cW9kOHllM2li "
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://github.com/saravanakumar505"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-400 transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className="border-t border-gray-700 mt-8 pt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ShoeStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
