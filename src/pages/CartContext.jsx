import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ✅ Fetch cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCart(res.data.items || []);
        localStorage.setItem("cart", JSON.stringify(res.data.items || []));
        console.log("🛒 Cart fetched:", res.data.items);
      } catch (err) {
        console.error("❌ Fetch cart failed:", err.response?.data || err.message);
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // ✅ Save cart to backend (optional optimistic update)
  const syncCart = async (updatedCart) => {
    if (!user?.token) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, updatedCart, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("💾 Cart synced with backend:", updatedCart);
    } catch (err) {
      console.error("❌ Sync failed:", err.response?.data || err.message);
    }
  };

  // ✅ Add item to cart
  const addToCart = async (product) => {
    // Normalize product data: Ensure productId exists
    let itemToAdd = { ...product };
    if (!itemToAdd.productId && itemToAdd._id) {
      itemToAdd.productId = itemToAdd._id;
    }

    if (!itemToAdd.productId) {
      console.error("❌ Invalid product data:", product);
      return;
    }

    const updatedCart = [...cart];
    const existing = updatedCart.find(
      (i) => i.productId === product.productId
    );

    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart); // Immediate UI update
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Added to cart! 🛒");
    await syncCart(product);
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, newQty) => {
    const updatedCart = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
      .filter((i) => i.quantity > 0);

    setCart(updatedCart); // UI updates instantly
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("✅ Quantity updated:", productId, newQty);
    } catch (err) {
      console.error("❌ Update quantity failed:", err.response?.data || err.message);
    }
  };

  // ✅ Remove item
  const removeFromCart = async (productId) => {
    const updatedCart = cart.filter((i) => i.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart`, {
        data: { productId },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("🗑️ Removed from backend:", productId);
    } catch (err) {
      console.error("❌ Remove failed:", err.response?.data || err.message);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("🧹 Cart cleared on backend");
    } catch (err) {
      console.error("❌ Clear cart failed:", err.response?.data || err.message);
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
