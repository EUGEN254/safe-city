import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export const SafeCityContext = createContext(null);

export const SafeCityContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const[unreadCount,setUnreadCount] = useState(4)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // fetching user
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/getme`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      toast.error("Failed to fetch user");
      console.error(error);
    }
  };

  // logout user
  const logout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setUser(null);
        toast.success(response.data.message);
        navigate("/"); 
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    backendUrl,
    logout,
    user,
    setUser,
    unreadCount,
    fetchCurrentUser,
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
