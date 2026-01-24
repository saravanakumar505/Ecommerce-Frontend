import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { customer, items, totalAmount } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");

  if (!customer || !items) {
    navigate("/checkout");
    return null;
  }

  // 🟢 Handle Razorpay Payment
  const handleOnlinePayment = async () => {
    try {
      const config = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

      // 1. Create Order on Backend
      const { data: { order: razorpayOrder } } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { amount: totalAmount },
        config
      );

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shoe Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              config
            );

            // 4. Place Internal Order
            const orderData = {
              items,
              totalAmount,
              customer,
              payment: {
                method: "Online",
                status: "Paid",
                transactionId: response.razorpay_payment_id,
                paymentDate: new Date(),
              },
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
            toast.success("🎉 Payment Successful!");
            navigate("/order-success", { state: { orderData } });

          } catch (err) {
            toast.error("Payment verification failed");
            console.error(err);
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Could not initiate payment");
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) return toast.error("Select a payment method");

    if (paymentMethod === "Online") {
      await handleOnlinePayment();
      return;
    }

    const orderData = {
      items,
      totalAmount,
      customer,
      payment: {
        method: paymentMethod,
        status: "Pending",
        transactionId: null,
        paymentDate: null,
      },
    };

    try {
      const config = user?.token ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};

      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
      toast.success("🎉 Order placed successfully!");
      navigate("/order-success", { state: { orderData } });
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      toast.error("Order failed, please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 font-poppins bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">💳 Choose Payment Method</h2>

      <div className="space-y-4 mb-6">
        <label className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="Online"
            checked={paymentMethod === "Online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>Online Payment (Razorpay)</span>
        </label>
      </div>

      <div className="flex justify-between mb-6">
        <p className="text-lg font-semibold">Total:</p>
        <p className="text-lg font-bold text-green-700">
          ₹{totalAmount.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
      >
        {paymentMethod === "Online" ? "Pay Now" : "Confirm Order"}
      </button>
    </div>
  );
};

export default PaymentPage;
