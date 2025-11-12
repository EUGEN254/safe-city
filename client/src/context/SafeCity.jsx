import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const SafeCityContext = createContext(null);

export const SafeCityContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [supportTeam, setSupportTeam] = useState([]);
  const [roles, setRoles] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messagesMap, setMessagesMap] = useState({}); // { userId: [messages] }
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  /** --------------------- SOCKET.IO --------------------- **/
  useEffect(() => {
    if (user) {
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      // Emit user-online when connected
      newSocket.on("connect", () => {
        newSocket.emit("user-online", {
          id: user._id,
          name: user.fullname,
          role: user.role || "user",
        });
      });

      // Listen for updated online users
      newSocket.on("update-online-users", (users) => {
        setOnlineUsers(users);
      });

      // Listen for incoming messages
      newSocket.on("receive-message", ({ fromUserId, message }) => {
        setMessagesMap((prev) => {
          const userMessages = prev[fromUserId] || [];
          return {
            ...prev,
            [fromUserId]: [...userMessages, message],
          };
        });
      });

      // Cleanup
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user, backendUrl]);

  /** --------------------- USER FETCH --------------------- **/
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/getme`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      if (error.response?.status === 401) setUser(null);
      console.error("Error fetching user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** --------------------- SUPPORT TEAM FETCH --------------------- **/
  const fetchSupportTeam = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-support`, {
        withCredentials: true,
      });

      if (!response.data.success) throw new Error(response.data.message);

      setSupportTeam(response.data.data || []);
      if (response.data.roles) setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching support team:", error);
    }
  };

  /** --------------------- LOGOUT --------------------- **/
  const logout = async () => {
    try {
      if (socket && user) {
        socket.emit("user-offline", user._id);
        console.log("Emitted user-offline for:", user._id);
      }

      const response = await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(null);

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

  /** --------------------- ONLINE STATUS --------------------- **/
  const isUserOnline = (userId) => onlineUsers.hasOwnProperty(userId);

  const getLastSeen = (userId) => {
    if (isUserOnline(userId)) return "Active now";
    const u = onlineUsers[userId];
    if (u?.lastSeen) return new Date(u.lastSeen).toLocaleString();
    return "Offline";
  };

  /** --------------------- INITIAL DATA --------------------- **/
  useEffect(() => {
    fetchCurrentUser();
    fetchSupportTeam();
  }, []);

  /** --------------------- CONTEXT VALUE --------------------- **/
  const value = {
    backendUrl,
    user,
    setUser,
    loading,
    logout,
    supportTeam,
    roles,
    unreadCount,
    messagesMap,
    setMessagesMap,
    socket,
    onlineUsers,
    isUserOnline,
    getLastSeen,
    fetchCurrentUser,
    fetchSupportTeam,
  };

  return (
    <SafeCityContext.Provider value={value}>
      {children}
    </SafeCityContext.Provider>
  );
};

export const useSafeCity = () => {
  const context = useContext(SafeCityContext);
  if (!context) {
    throw new Error(
      "useSafeCity must be used within a SafeCityContextProvider"
    );
  }
  return context;
};
