import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BrandProducts = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!brandName) return;
      try {
        console.log("🔍 Fetching products for brand:", brandName);

        // Fetch brand products (case insensitive)
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?brand=${brandName.toLowerCase()}`
        );

        console.log("✅ Brand Response:", res.data);
        setProducts(res.data.items || res.data); // support both formats
      } catch (err) {
        console.error("❌ Failed to load brand products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandName]);



  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading products...</p>;

  return (
    <div className="px-6 md:px-14 py-10 font-poppins">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 capitalize text-center">
        {brandName} Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products found for <span className="font-semibold">{brandName}</span>.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white p-3 rounded-lg shadow hover:shadow-xl transition cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 md:h-56 object-contain rounded-md"
                />
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>

              {/* Product Name */}
              <p className="text-sm mt-2 text-gray-700 line-clamp-1">
                {product.name}
              </p>

              {/* Product Price */}
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-gray-900">
                  ₹ {product.offerPrice || product.price}
                </p>
                {product.offerPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹ {product.price}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProducts;
