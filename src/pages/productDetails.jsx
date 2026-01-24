import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CartContext } from "./CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(null);

  // ✅ Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);

        // ✅ Ensure _id always exists (normalize if backend uses "id")
        const normalized = {
          ...res.data,
          _id: res.data._id || res.data.id || id,
        };

        setProduct(normalized);
        setMainImage(normalized.images?.[0]);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading product...</p>;

  if (!product)
    return <p className="text-center text-gray-500 mt-10">Product not found.</p>;

  const sizes = ["6", "7", "8", "9", "10", "11"];

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (product.stock <= 0) return toast.error("❌ This product is out of stock!");
    if (!selectedSize) return toast.error("Please select a size 👕");

    const cartItem = {
      productId: product._id, // ✅ guaranteed to exist now
      name: product.name,
      img: product.images?.[0],
      price: product.offerPrice || product.price,
      size: selectedSize,
      qty: 1,
    };

    // console.log("🧾 Adding to cart:", cartItem);
    addToCart(cartItem);

  };

  // ✅ Buy Now (Send full item to Checkout)
  const handleBuyNow = () => {
    if (product.stock <= 0) return toast.error("❌ This product is out of stock!");
    if (!selectedSize) return toast.error("Please select a size before buying 👕");

    const buyNowItem = {
      productId: product._id, // ✅ guaranteed now
      name: product.name,
      img: product.images?.[0],
      price: product.offerPrice || product.price,
      size: selectedSize,
      qty: 1,
    };

    // addToCart(buyNowItem); // Removed as per user request
    navigate("/checkout", { state: { buyNowItem } });
  };

  return (
    <div className="px-6 md:px-20 py-10 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* ✅ Product Images */}
        <div className="flex flex-col items-center">
          <img
            src={mainImage || "/placeholder.jpg"}
            alt={product.name}
            className="w-full max-w-md h-96 object-contain rounded-lg shadow-md mb-4"
          />

          <div className="flex gap-3 overflow-x-auto justify-center">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 object-contain border-2 rounded-md cursor-pointer ${mainImage === img
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ✅ Product Info */}
        <div>
          <h1 className="text-3xl font-semibold mb-3 text-gray-900">
            {product.name}
          </h1>

          {/* ✅ Description */}
          {Array.isArray(product.description) ? (
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {product.description.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mb-4">{product.description}</p>
          )}

          {/* ✅ Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                In Stock ({product.stock} left)
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* ✅ Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-800">Select Size:</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border transition ${selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:border-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ₹ {product.offerPrice || product.price}
            </span>
            {product.offerPrice && (
              <span className="text-gray-500 line-through">
                ₹ {product.price}
              </span>
            )}
          </div>

          {/* ✅ Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`px-6 py-2 rounded-lg text-white transition ${product.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
                }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`px-6 py-2 rounded-lg text-white transition ${product.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
