import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth(false);
  };

  if (!auth) return <Login setAuth={setAuth} />;

  return role === "admin" ? (
    <AdminDashboard logout={logout} />
  ) : (
    <Dashboard logout={logout} />
  );
}

export default App;
