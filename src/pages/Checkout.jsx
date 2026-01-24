// src/pages/Checkout.jsx
import React, { useContext, useState, useMemo, useEffect } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart = [], clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Get user from context
  const location = useLocation();
  const navigate = useNavigate();

  const buyNowItem = location.state?.buyNowItem || null;
  const itemsToShow = buyNowItem ? [buyNowItem] : cart;

  // ✅ Calculate total safely
  const finalTotal = useMemo(
    () =>
      itemsToShow.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0) *
          (Number(item.quantity) || Number(item.qty) || 1),
        0
      ),
    [itemsToShow]
  );

  // ✅ Billing details form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ✅ Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Proceed to payment page (instead of directly placing order)
  const placeOrder = () => {
    for (let key in form) {
      if (!form[key]) return toast.error("Please fill all fields");
    }

    // Pass data to Payment Page
    navigate("/payment", {
      state: {
        customer: form,
        items: itemsToShow,
        totalAmount: finalTotal,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-poppins">
      {/* 🧾 Billing Info */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Billing Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(form).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              className="border p-3 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          ))}
        </div>
      </div>

      {/* 🛍️ Order Summary */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {itemsToShow.map((item) => (
          <div
            key={`${item.productId || item._id}-${item.size || "default"}`}
            className="flex justify-between border-b pb-3 mb-3"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-500 text-sm">
                Size: {item.size || "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                Qty: {item.quantity || item.qty || 1}
              </p>
            </div>
            <p className="font-bold text-gray-800">
              ₹
              {(
                (item.price || 0) *
                (item.quantity || item.qty || 1)
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ))}

        <div className="flex justify-between text-lg font-bold mt-3">
          <span>Total:</span>
          <span>₹{finalTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* ✅ Proceed Button */}
      <button
        onClick={placeOrder}
        className="mt-5 w-full bg-green-600 text-white py-3 rounded-md text-lg font-medium hover:bg-green-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
