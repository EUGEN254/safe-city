import React, { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginSignUp = () => {
  const { backendUrl, setAdmin, fetchCurrentAdmin } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Kindly fill all fields");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/`,
        { email, password, role: "admin" },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Login Successful!");
        // Set admin from login response
        if (response.data.admin) {
          setAdmin(response.data.admin);
        } else {
          // fetch fresh admin data if not in response
          await fetchCurrentAdmin();
        }
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-safecity-dark px-4">
      <div className="bg-safecity-surface text-safecity-text rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Admin Login</h2>
        <p className="text-safecity-muted text-center mb-8">
          Enter your credentials to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-safecity-accent transition">
            <FiUser className="text-gray-400 dark:text-gray-300" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-safecity-accent transition">
            <FiLock className="text-gray-400 dark:text-gray-300" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-safecity-accent hover:bg-safecity-accent-hover text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-safecity-muted text-center mt-6 text-sm">
          © 2025 SafeCity. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginSignUp;
