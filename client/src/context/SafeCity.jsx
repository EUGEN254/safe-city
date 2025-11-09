import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const SafeCityContext = createContext(null);

export const SafeCityContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [unreadCount, setUnreadCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [supportTeam, setSupportTeam] = useState([]);
   const [onlineUsers, setOnlineUsers] = useState({});
  const[roles,setRoles]= useState([])
  const navigate = useNavigate();

  // Initializing socket
  useEffect(() => {
    if (user) {
      const newSocket = io(backendUrl); //these is where socket id is created
      setSocket(newSocket);

      // Emit user-online when socket connects and user is available
      newSocket.on("connect", () => {
        newSocket.emit("user-online", {
          id: user._id,
          name: user.fullname,
        });
      });

      newSocket.on("update-online-users", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on unmount or when user changes
      return () => {
        newSocket.disconnect();
        setSocket(null)
      };
    }
  }, [user, backendUrl]);

  // fetching user
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
      if (error.response?.status === 401) {
        setUser(null);
        return null;
      } else {
        console.error("Error fetching user:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // fetching support team
  const fetchSupportTeam = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-support`, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Set the support team data from the response
      setSupportTeam(response.data.data);

      // Optional: If you want to also store the roles separately
      if (response.data.roles) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching support team:", error);
    }
  };

  // logout user
  const logout = async () => {
    try {
      const currentUser = user;

      // Emit user-offline event BEFORE making logout request
      if (socket && currentUser) {
        socket.emit("user-offline", currentUser._id);
        console.log("Emitted user-offline for:", currentUser._id);
      }

      // Make logout request
      const response = await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(null);

        // Disconnect socket after logout
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

  const addReport = () => {};

  const isUserOnline = (userId) => {
    return onlineUsers.hasOwnProperty(userId);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchSupportTeam();
  }, []);

  const value = {
    backendUrl,
    logout,
    user,
    loading,
    setUser,
    unreadCount,
    supportTeam,
    isUserOnline,
    addReport,
    roles,
    fetchCurrentUser,
    fetchSupportTeam ,
    socket,
  };

  return (
    <SafeCityContext.Provider value={value}>
      {props.children}
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
