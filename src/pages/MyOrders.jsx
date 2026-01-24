import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            if (!user) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await API.get("/api/orders/myorders", config);
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "text-green-600 bg-green-50";
            case "Shipped": return "text-blue-600 bg-blue-50";
            case "Cancelled": return "text-red-600 bg-red-50";
            default: return "text-yellow-600 bg-yellow-50";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered": return <CheckCircle size={16} />;
            case "Cancelled": return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Package className="text-black" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-blue-600 hover:underline">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono text-xs font-medium text-gray-700">#{order._id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-gray-900">${order.totalAmount}</p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.productId?.images?.[0] || "https://placehold.co/100"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Link to={`/product/${item.product || item.productId}`} className="font-medium text-gray-800 hover:underline">
                                                    {item.name || "Product"}
                                                </Link>
                                                <p className="text-sm text-gray-500">Size: {item.size} • Qty: {item.qty || item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
