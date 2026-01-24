import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    offerPrice: "",
    stock: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages(newImages);
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!product.name || !product.brand || !product.category || !product.price) {
        toast.error("⚠️ Please fill in all required fields");
        setLoading(false);
        return;
      }

      const productData = {
        ...product,
        brand: product.brand.trim().toLowerCase(),
        description: product.description.split("\n").filter(Boolean),
        images,
      };

      await axios.post("http://localhost:5000/api/products", productData);
      toast.success("✅ Product added successfully!");

      // Reset form
      setProduct({
        name: "",
        brand: "",
        category: "",
        price: "",
        offerPrice: "",
        stock: "",
        description: "",
      });
      setImages([]);
    } catch (err) {
      console.error("❌ Failed to add product:", err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md font-poppins">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">➕ Add New Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 🏷️ Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="border p-3 rounded-md"
          required
        />

        {/* 🏷️ Brand */}
        <input
          type="text"
          name="brand"
          placeholder="Brand (e.g., Nike, Adidas)"
          value={product.brand}
          onChange={handleChange}
          className="border p-3 rounded-md"
          required
        />

        {/* 🏷️ Category */}
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Sports Shoes)"
          value={product.category}
          onChange={handleChange}
          className="border p-3 rounded-md"
          required
        />

        {/* 💰 Prices */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price ₹"
            value={product.price}
            onChange={handleChange}
            className="border p-3 rounded-md"
            required
          />
          <input
            type="number"
            name="offerPrice"
            placeholder="Offer Price ₹"
            value={product.offerPrice}
            onChange={handleChange}
            className="border p-3 rounded-md"
          />
        </div>

        {/* 📦 Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={product.stock}
          onChange={handleChange}
          className="border p-3 rounded-md"
          required
        />

        {/* 📝 Description */}
        <textarea
          name="description"
          placeholder="Description (one feature per line)"
          value={product.description}
          onChange={handleChange}
          className="border p-3 rounded-md h-32 resize-none"
          required
        />

        {/* 🖼️ Image Upload */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Upload Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded-md w-full"
          />

          {/* Preview */}
          <div className="flex flex-wrap gap-3 mt-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* 🧩 Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
