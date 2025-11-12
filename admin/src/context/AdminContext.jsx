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
  const [messagesMap, setMessagesMap] = useState({}); // { userId: [messages] }
  const navigate = useNavigate();

  // Initialize socket connection ONLY when admin exists
  useEffect(() => {
    if (admin) {
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      // Emit user-online when socket connects
      newSocket.on("connect", () => {
        newSocket.emit("user-online", {
          id: admin._id,
          name: admin.fullname,
          role: admin.role || "admin",
        });
      });

      // Update online users
      newSocket.on("update-online-users", (users) => {
        setOnlineUsers(users);
      });

      // Listen for incoming messages
      newSocket.on("receive-message", ({ fromUserId, message }) => {
        setMessagesMap((prev) => {
          const userMessages = prev[fromUserId] || [];
          return { ...prev, [fromUserId]: [...userMessages, message] };
        });
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [admin, backendUrl]);

  // Fetch current admin
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

  // Logout admin
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

  // Fetch all users
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

  // Check if user is online
  const isUserOnline = (userId) => onlineUsers.hasOwnProperty(userId);

  // Count online users (role === "user")
  const onlineUsersCount = Object.values(onlineUsers).filter(
    (user) => user.role === "user"
  ).length;

  // Send message via socket
  const sendMessage = async (receiverId, text, file = null) => {
    if (!socket || !admin) return;
    if (!text?.trim() && !file) return; // nothing to send

    const formData = new FormData();
    formData.append("senderId", admin._id);
    formData.append("receiverId", receiverId);
    formData.append("text", text);
    if (file) formData.append("image", file);

    try {
      const res = await axios.post(
        `${backendUrl}/api/messages/send`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        const msg = res.data.data;

        // Emit via socket
        socket.emit("send-message", {
          toUserId: receiverId,
          message: msg,
        });

        // Update local messages state
        setMessagesMap((prev) => {
          const userMessages = prev[receiverId] || [];
          return { ...prev, [receiverId]: [...userMessages, msg] };
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

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
    messagesMap,
    sendMessage,
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
