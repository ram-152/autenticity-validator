import React, { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard({ logout }) {
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.get("/admin/dashboard", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data.users);
      setCertificates(res.data.certificates);
    } catch (err) {
      alert("Unauthorized. Please login again.");
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await API.post(
        "/admin/create-user",
        { email, password, role },
        { headers: { "x-auth-token": token } }
      );
      setMsg(res.data.msg);
      setEmail("");
      setPassword("");
      setRole("user");
      fetchData(); // refresh user list
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to create user");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={logout} style={{ float: "right" }}>Logout</button>

      <h3>Create New User</h3>
      {msg && <p>{msg}</p>}
      <form onSubmit={createUser}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br /><br />
        <button type="submit">Create User</button>
      </form>

      <hr />

      <h3>Registered Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.email} ({u.role})</li>
        ))}
      </ul>

      <h3>Certificates</h3>
      <ul>
        {certificates.map((c) => (
          <li key={c._id}>
            {c.studentName} - {c.certificateId}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
