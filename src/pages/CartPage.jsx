// src/pages/CartPage.jsx
import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import { FaTrash } from "react-icons/fa";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart = [], updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext) || {};

  const safeCart = Array.isArray(cart) ? cart : [];

  const total = useMemo(
    () =>
      safeCart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [safeCart]
  );

  if (!safeCart) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>
        <p className="text-gray-600 text-lg">Loading your cart...</p>
      </div>
    );
  }

  const handleBuyNow = (item) => {
    navigate("/checkout", { state: { buyNowItem: item } });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        🛒 Your Cart
      </h2>

      {safeCart.length === 0 ? (
        <p className="text-gray-600 text-lg text-center md:text-left">
          Your cart is empty 😕
        </p>
      ) : (
        <>
          <div className="space-y-5">
            {safeCart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md p-4 rounded-lg gap-4"
              >
                {/* 🖼 Product Image & Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-5 text-center sm:text-left w-full sm:w-auto">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-28 h-28 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")} ×{" "}
                      {item.quantity}
                    </p>
                    <p className="font-bold text-gray-800 mt-1">
                      ₹
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* 🔘 Quantity & Actions */}
                <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={18} />
                  </button>

                  {/* 🛍 Buy Now button for each item */}
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 💰 Cart Summary */}
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-center sm:text-left">
              Total: ₹{total.toLocaleString("en-IN")}
            </h3>
            <div className="space-x-4 flex flex-wrap justify-center">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout", { state: { cart: safeCart } })}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
