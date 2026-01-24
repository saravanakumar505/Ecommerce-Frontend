import React, { useMemo, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../pages/data/data";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import toast from "react-hot-toast";

const ProductCard = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (searchQuery) {
      document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchQuery]);

  const addToWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await API.post("/api/users/wishlist", { productId }, config);
      toast.success("Product added to your Wishlist ❤️");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to Wishlist");
    }
  };

  // ✅ Always run hooks at top-level — never inside conditionals
  const groupedProducts = useMemo(() => {
    if (!products || !products.length) return [];

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      return products.filter((p) =>
        p.name.toLowerCase().includes(lowerQ) ||
        (p.brand && p.brand.toLowerCase().includes(lowerQ))
      );
    }

    const brands = ["nike", "puma", "adidas", "skechers", "crocs", "vfcorporation", "deckersbrands"];
    const filtered = brands.flatMap((brand) =>
      products
        .filter(
          (p) =>
            typeof p.brand === "string" &&
            p.brand.toLowerCase().trim().includes(brand)
        )
        .slice(0, 2)
    );

    return filtered.length ? filtered : products;
  }, [products, searchQuery]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (!products.length) return <p className="text-center mt-10">No products found.</p>;

  return (
    <div id="product-section" className="px-4 md:px-14 py-10 font-poppins bg-gray-50/50">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold text-gray-800 text-center mb-2"
      >
        {searchQuery ? `Results for "${searchQuery}"` : "New Arrivals"}
      </motion.h1>
      {!searchQuery && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-center mb-10"
        >
          Latest drops from all top brands
        </motion.p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
      >
        {groupedProducts.map((product) => (
          <motion.div
            key={product._id}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-3 rounded-lg shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
          >
            <Link to={`/product/${product._id}`}>
              <div className="relative overflow-hidden rounded-md group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  className="w-full h-48 md:h-56 object-contain"
                />
                <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                  NEW
                </span>

                <button
                  onClick={(e) => addToWishlist(e, product._id)}
                  className="absolute top-2 right-2 bg-white/70 p-1.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
                  title="Add to Wishlist"
                >
                  <Heart size={16} />
                </button>
              </div>

              <p className="text-sm mt-3 text-gray-700 line-clamp-1 font-medium group-hover:text-black">
                {product.name}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <p className="text-md font-bold text-gray-900">
                  ₹{product.offerPrice || product.price}
                </p>

                {product.offerPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    ₹{product.price}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductCard;
