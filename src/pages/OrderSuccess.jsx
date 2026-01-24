import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.orderData;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          ✅ Order Placed Successfully!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you, {order?.customer?.name || "Customer"}! <br />
          Your order will be processed shortly.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
