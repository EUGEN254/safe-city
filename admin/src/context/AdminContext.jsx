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

  // Initialize socket connection ONLY when admin exists
  useEffect(() => {
    if (admin) {
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      // Emit user-online when socket connects and user is available
      newSocket.on("connect", () => {
        newSocket.emit("user-online", {
          id: admin._id,
          name: admin.fullname,
          role: admin.role || "admin",
        });
      });

      newSocket.on("update-online-users", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Clean up socket if admin logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [admin, backendUrl]);

  // Improved fetchCurrentAdmin
  const fetchCurrentAdmin = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/get-admin`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.admin) {
        setAdmin(response.data.admin);
        return response.data.admin;
      } else {
        setAdmin(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      setAdmin(null);
      return null;
    }
  };

  // logout admin - FIXED setAdmin instead of setUser
  const logout = async () => {
    try {
      const currentUser = admin;

      // Emit user-offline event
      if (socket && currentUser) {
        socket.emit("user-offline", currentUser._id);
        console.log("Emitted user-offline for:", currentUser._id);
      }

      const response = await axios.post(
        `${backendUrl}/api/admin/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setAdmin(null);

        if (socket) {
          socket.disconnect();
          setSocket(null);
        }

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
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeAdmin = async () => {
      setLoading(true);
      await fetchCurrentAdmin();
      await fetchUser();
      setLoading(false);
    };

    initializeAdmin();
  }, []);

  const isUserOnline = (userId) => {
    return onlineUsers.hasOwnProperty(userId);
  };

  const onlineUsersCount = Object.values(onlineUsers).filter(
  (user) => user.role === "user"
).length;


  const value = {
    backendUrl,
    admin,
    fetchCurrentAdmin,
    setAdmin,
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
