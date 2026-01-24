import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/api"; // ✅ Automatically sends token via interceptor
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Fetch using pre-configured axios instance
        const res = await api.get("/api/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-lg min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        👋 Welcome, {user?.name} (Admin)
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Monthly Sales & Orders
        </h3>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                strokeWidth={3}
                name="Sales (₹)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={3}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="p-3">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">{o.customer?.name || "-"}</td>
                    <td className="p-3">₹{o.totalAmount}</td>
                    <td className="p-3">{o.status}</td>
                    <td className="p-3">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-gray-500" colSpan="5">
                    No recent orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
