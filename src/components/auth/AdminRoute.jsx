import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  // 🧠 Case 1: Not logged in at all → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🧠 Case 2: Logged in but not an admin → redirect to home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 🧠 Case 3: Logged in and isAdmin = true → render admin content
  return <Outlet />;
};

export default AdminRoute;
