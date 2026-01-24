import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/"); // redirect to home after successful register
    } catch (err) {
      console.error("❌ Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>

      <p className="text-center text-sm mt-4 text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Register;
