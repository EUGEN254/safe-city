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
  const [supportTeam, setSupportTeam] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messagesMap, setMessagesMap] = useState({}); 
  const [unreadCount, setUnreadCount] = useState(0);
  
  // NEW STATES FOR NOTIFICATIONS AND MESSAGES
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const navigate = useNavigate();

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

  /** --------------------- FETCH NOTIFICATIONS --------------------- **/
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/notifications`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        // Calculate unread count
        const unread = response.data.notifications.filter(notif => !notif.read).length;
        setUnreadNotifications(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  /** --------------------- FETCH MESSAGES --------------------- **/
  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/messages/conversations`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Transform messages into the messagesMap structure
        const messagesMap = {};
        response.data.conversations.forEach(conv => {
          messagesMap[conv.userId] = conv.messages;
        });
        setMessagesMap(messagesMap);
        
        // Calculate unread messages count
        let totalUnread = 0;
        Object.values(messagesMap).forEach(messages => {
          totalUnread += messages.filter(msg => 
            !msg.read && msg.receiverId === user._id
          ).length;
        });
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    } catch (error) {
      console.error("Error fetching support team:", error);
    }
  };

  /** --------------------- MARK NOTIFICATION AS READ --------------------- **/
  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadNotifications(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  /** --------------------- MARK MESSAGES AS READ --------------------- **/
  const markMessagesAsRead = async (userId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/messages/read/${userId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessagesMap(prev => ({
          ...prev,
          [userId]: prev[userId]?.map(msg => 
            msg.receiverId === user._id ? { ...msg, read: true } : msg
          ) || []
        }));
        
        // Recalculate unread count
        let totalUnread = 0;
        Object.values(messagesMap).forEach(messages => {
          totalUnread += messages.filter(msg => 
            !msg.read && msg.receiverId === user._id
          ).length;
        });
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
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
        setNotifications([]);
        setUnreadNotifications(0);
        setMessagesMap({});
        setUnreadCount(0);

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
        
        // Show toast notification for new message
        if (!showMessages) {
          toast.info(`New message from ${message.senderName || 'User'}`);
        }
      });

      // Listen for new notifications
      newSocket.on("new-notification", (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadNotifications(prev => prev + 1);
        toast.info(notification.message || "New notification");
      });

      // Cleanup
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user, backendUrl, showMessages]);

  /** --------------------- INITIAL DATA --------------------- **/
  useEffect(() => {
    const initializeApp = async () => {
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        // Fetch these in parallel for better performance
        await Promise.all([
          fetchNotifications(),
          fetchMessages(),
          fetchSupportTeam()
        ]);
      }
    };

    initializeApp();
  }, []); // Empty dependency array - only run once on mount

  /** --------------------- CONTEXT VALUE --------------------- **/
  const value = {
    backendUrl,
    user,
    setUser,
    loading,
    logout,
    supportTeam,
    unreadCount,
    messagesMap,
    setMessagesMap,
    socket,
    onlineUsers,
    isUserOnline,
    getLastSeen,
    fetchCurrentUser,
    fetchSupportTeam,
    
    // NEW FUNCTIONS AND STATES
    notifications,
    unreadNotifications,
    showNotifications,
    setShowNotifications,
    showMessages,
    setShowMessages,
    fetchNotifications,
    fetchMessages,
    markNotificationAsRead,
    markMessagesAsRead,
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