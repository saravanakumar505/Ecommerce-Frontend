// src/components/admin/EditProduct.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();

  // Example: In a real app, you’d fetch the product by ID
  const [product, setProduct] = useState({
    name: "Nike Pegasus 41",
    price: 159.99,
    category: "Shoes",
    stock: 12,
    image:
      "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Product updated successfully!");
    console.log("Updated Product:", product);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <img
            src={product.image}
            alt="Product Preview"
            className="mt-2 w-32 h-32 object-cover border rounded"
          />
        </div>

        <div className="flex justify-between">
          <Link
            to="/admin/products"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            ← Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
