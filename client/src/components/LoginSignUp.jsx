import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeCity } from "../context/SafeCity";


const LoginSignUp = ({ showLogin, setShowLogin }) => {
  const navigate = useNavigate();
  const { backendUrl, fetchCurrentUser, setUser ,socket} = useSafeCity(); 
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [isLogin]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password, rememberMe }
        : {
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        let currentUser;

        if (response.data.user) {
          setUser(response.data.user);
          currentUser = response.data.user;
        } else {
          currentUser = await fetchCurrentUser(); 
          setUser(currentUser)
        }

        // Emit user-online event to server
        if (socket && currentUser) {
          socket.emit("user-online", {
            id: currentUser._id,
            name: currentUser.fullname,
            role:currentUser.role ,
          });
        }

        setShowLogin(false);
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Form Card */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
            }}
            className="relative w-full max-w-sm bg-safecity-surface text-safecity-text rounded-2xl shadow-xl border border-[rgba(255,255,255,0.1)] p-6"
          >
            {/* Close */}
            <button
              onClick={() => !isSubmitting && setShowLogin(false)}
              disabled={isSubmitting}
              className="absolute -top-2 -right-2 bg-safecity-dark rounded-full p-2 shadow-md text-safecity-muted hover:text-safecity-accent hover:bg-safecity-surface transition"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="bg-safecity-accent p-2 rounded-xl inline-block mb-3">
                <MdSecurity className="text-xl text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                {isLogin ? "Welcome Back" : "Join SafeCity"}
              </h1>
              <p className="text-safecity-muted text-sm mt-1">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-safecity-dark rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => !isSubmitting && setIsLogin(true)}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                  isLogin
                    ? "bg-safecity-surface text-safecity-accent shadow-md"
                    : "text-safecity-muted"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsLogin(false)}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                  !isLogin
                    ? "bg-safecity-surface text-safecity-accent shadow-md"
                    : "text-safecity-muted"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-safecity-muted text-sm" />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 py-3 bg-safecity-dark rounded-xl focus:ring-2 focus:ring-safecity-accent text-sm placeholder-safecity-muted"
                  />
                </div>
              )}

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-safecity-muted text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3 py-3 bg-safecity-dark rounded-xl focus:ring-2 focus:ring-safecity-accent text-sm placeholder-safecity-muted"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-safecity-muted text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-3 bg-safecity-dark rounded-xl focus:ring-2 focus:ring-safecity-accent text-sm placeholder-safecity-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-safecity-muted hover:text-safecity-accent text-sm"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {isLogin && (
                <div className="flex flex-row justify-between items-center text-sm">
                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="rememberMe" className="text-safecity-muted">
                      Remember me
                    </label>
                  </div>
                  <div>
                    <Link className="text-safecity-accent hover:text-safecity-accent-hover cursor-pointer text-sm">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-safecity-muted text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 py-3 bg-safecity-dark rounded-xl focus:ring-2 focus:ring-safecity-accent text-sm placeholder-safecity-muted"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-safecity-accent hover:bg-safecity-accent-hover text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginSignUp;
