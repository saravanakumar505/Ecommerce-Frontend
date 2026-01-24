import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import { CartContext } from "./CartContext";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            if (!user) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await API.get("/api/users/wishlist", config);
            setWishlist(data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await API.delete(`/api/users/wishlist/${productId}`, config);
            setWishlist(wishlist.filter((item) => item._id !== productId));
            toast.success("Product removed from Wishlist 💔");
        } catch (error) {
            toast.error("Could not remove item from Wishlist");
        }
    };

    if (loading) return <div className="text-center py-20">Loading wishlist...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">My Wishlist ❤️</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                    <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
                            <div className="relative aspect-square bg-gray-50">
                                <img
                                    src={product.images?.[0] || "https://placehold.co/400"}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                                </Link>
                                <p className="text-gray-500 text-sm mb-3">{product.brand}</p>

                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg">${product.price}</span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => removeFromWishlist(product._id)}
                                            className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            title="Remove from Wishlist"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
