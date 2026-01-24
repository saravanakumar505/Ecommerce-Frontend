import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Save the user data + token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ Update context
      setUser(res.data);

      console.log("✅ Logged in:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Register function
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      // ✅ Save the user data + token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ Update context
      setUser(res.data);

      console.log("✅ Registered & Logged in:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
