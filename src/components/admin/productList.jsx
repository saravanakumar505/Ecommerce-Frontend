import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null); // Track product being edited
  const [editedData, setEditedData] = useState({}); // Store temp edits

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const all = res.data.items || res.data;

        // ✅ Normalize brand names
        const cleanData = all.map((p) => ({
          ...p,
          brand: p.brand?.trim().toLowerCase() || "unknown",
        }));

        setProducts(cleanData);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditMode(product._id);
    setEditedData({
      price: product.price,
      offerPrice: product.offerPrice,
      stock: product.stock,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, editedData);
      toast.success("✅ Product updated!");

      // Update state locally
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, ...editedData } : p
        )
      );

      setEditMode(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("🗑️ Product deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  // ✅ Group by brand
  const groupedByBrand = products.reduce((acc, p) => {
    const brand = p.brand || "unknown";
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(p);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      {Object.keys(groupedByBrand).map((brand) => (
        <div key={brand} className="mb-10 bg-white p-4 rounded-lg shadow">
          {/* 🏷️ Brand Header */}
          <h3 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
            {brand} ({groupedByBrand[brand].length})
          </h3>

          {/* 🧱 Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Offer</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {groupedByBrand[brand].map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{p.name}</td>

                    {/* Editable Price */}
                    <td className="p-3">
                      {editMode === p._id ? (
                        <input
                          type="number"
                          name="price"
                          value={editedData.price}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-20"
                        />
                      ) : (
                        <>₹{p.price}</>
                      )}
                    </td>

                    {/* Editable Offer Price */}
                    <td className="p-3 text-green-600 font-semibold">
                      {editMode === p._id ? (
                        <input
                          type="number"
                          name="offerPrice"
                          value={editedData.offerPrice}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-20"
                        />
                      ) : (
                        <>₹{p.offerPrice || "-"}</>
                      )}
                    </td>

                    {/* Editable Stock */}
                    <td className="p-3">
                      {editMode === p._id ? (
                        <input
                          type="number"
                          name="stock"
                          value={editedData.stock}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-16"
                        />
                      ) : (
                        p.stock
                      )}
                    </td>

                    <td className="p-3">{p.category}</td>

                    {/* Edit / Save / Delete Buttons */}
                    <td className="p-3 text-center space-x-2">
                      {editMode === p._id ? (
                        <button
                          onClick={() => handleSave(p._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
