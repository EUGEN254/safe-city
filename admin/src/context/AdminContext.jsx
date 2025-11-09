import { createContext, useContext, useEffect, useState } from "react";
import {toast} from 'react-toastify'
import axios from "axios"

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

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
    }finally{
      setLoading(false);
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
