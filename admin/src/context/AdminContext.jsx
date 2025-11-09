import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(100);
  const [onlineUsers, setOnlineUsers] = useState({}); 
  const [socket, setSocket] = useState(null); 
  const navigate = useNavigate();

  // Initialize socket connection for admin panel
  useEffect(() => {
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    console.log("Admin socket initialized");

    // Listen for online users updates from server
    newSocket.on("update-online-users", (users) => {
      console.log("📊 Online users received:", users);
      setOnlineUsers(users);
    });

    // Handle connection events
    newSocket.on("connect", () => {
      console.log("✅ Admin socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Admin socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔴 Admin socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      console.log("🛑Cleaning up admin socket");
      newSocket.disconnect();
    };
  }, [backendUrl]);

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
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to logout"
      );
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true); 
      const response = await axios.get(
        `${backendUrl}/api/admin/get-all-users`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      setFetchedUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to get users"
      );
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCurrentAdmin();
    fetchUser();
  }, []);

  // Helper function to check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.hasOwnProperty(userId);
  };

  // Get online users count
  const onlineUsersCount = Object.keys(onlineUsers).length;

  const value = {
    backendUrl,
    admin,
    fetchCurrentAdmin,
    setAdmin,
     fetchUser,
    loading,
    fetchedUsers,
    fetchUser,
    unreadCount,
    logout,
    setLoading,
    onlineUsers, 
    isUserOnline,
    onlineUsersCount, 
    socket, 
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