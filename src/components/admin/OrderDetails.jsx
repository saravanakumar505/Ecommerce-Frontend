import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🧾 Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        const data = res.data.order || res.data;
        setOrder(data);
        setNewStatus(data.status);
      } catch (err) {
        console.error("❌ Failed to load order:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ Update order status
  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, {
        status: newStatus,
      });

      toast.success("✅ Order status updated successfully!");
      setOrder({ ...order, status: newStatus }); // Update UI immediately
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10">Order not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow font-poppins">
      <h2 className="text-2xl font-bold mb-4">🧾 Order Details</h2>

      {/* Customer Info */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-2">👤 Customer</h3>
        <p><strong>Name:</strong> {order.customer?.name}</p>
        <p><strong>Email:</strong> {order.customer?.email}</p>
        <p><strong>Phone:</strong> {order.customer?.phone}</p>
        <p><strong>Address:</strong> {order.customer?.address}</p>
      </div>

      {/* Ordered Items */}
      <h3 className="text-lg font-semibold mb-2">🛍️ Items</h3>
      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between border-b py-2">
          <div>
            <p>{item.name}</p>
            <p className="text-sm text-gray-500">
              Size: {item.size} | Qty: {item.qty}
            </p>
          </div>
          <p className="font-semibold">₹{item.price * item.qty}</p>
        </div>
      ))}

      {/* Summary */}
      <div className="flex justify-between font-bold text-xl mt-4">
        <span>Total:</span>
        <span>₹{order.totalAmount}</span>
      </div>

      {/* ✅ Status Management */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">📦 Order Status</h3>
        <div className="flex items-center gap-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className={`px-4 py-2 rounded-md text-white ${
              updating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>

        <p className="mt-3 text-gray-600">
          Current status:{" "}
          <span className="font-semibold text-yellow-600">
            {order.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
