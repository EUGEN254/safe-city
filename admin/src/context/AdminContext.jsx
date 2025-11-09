import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(100);
  const navigate = useNavigate();

  // fetch admin
  const fetchCurrentAdmin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/admin/get-admin`, {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to get admin"
      );
    } finally {
      setLoading(false);
    }
  };

  // logout admin
  const logout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/admin/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        response?.data?.message || error.message || "Failed to logout"
      );
    }
  };

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  const value = {
    backendUrl,
    admin,
    fetchCurrentAdmin,
    setAdmin,
    loading,
    unreadCount,
    logout,
    setLoading,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminContextProvider");
  }
  return context;
};
