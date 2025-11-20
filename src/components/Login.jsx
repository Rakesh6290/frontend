import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/token/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e3f2fd, #fce4ec)",
        fontFamily: "Poppins",
      }}
    >
      <div
        className="shadow-lg p-4 bg-white"
        style={{
          width: "330px",
          borderRadius: "18px",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h3
          className="text-center mb-2 fw-bold"
          style={{ color: "#1976d2", fontSize: "24px" }}
        >
          Welcome Back 👋
        </h3>

        <p className="text-center text-muted mb-3" style={{ fontSize: "13px" }}>
          Login to access your dashboard
        </p>

        <form onSubmit={submit}>
          {/* Username */}
          <div className="mb-2">
            <label className="form-label fw-semibold small">Username</label>
            <input
              required
              className="form-control rounded-3 px-3 py-2"
              style={{
                border: "1px solid #d0d6e0",
                transition: "0.2s",
              }}
              placeholder="Enter username"
              onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.target.style.borderColor = "#d0d6e0")}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label fw-semibold small">Password</label>
            <input
              required
              type="password"
              className="form-control rounded-3 px-3 py-2"
              style={{
                border: "1px solid #d0d6e0",
                transition: "0.2s",
              }}
              placeholder="Enter password"
              onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.target.style.borderColor = "#d0d6e0")}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100 py-2 mt-2 rounded-3"
            style={{
              background: "linear-gradient(135deg, #1976d2, #004ba0)",
              color: "white",
              fontWeight: 600,
              letterSpacing: "0.3px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.9")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: "14px" }}>
          Don't have an account?{" "}
          <span
            className="fw-bold"
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

