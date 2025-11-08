import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export const SafeCityContext = createContext(null);

export const SafeCityContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const[unreadCount,setUnreadCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // fetching user
  const fetchCurrentUser = async () => {
    setLoading(true); 
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
      // Handle 401 silently (user not logged in - normal case)
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error('Error fetching user:', error);
      }
    } finally {
      setLoading(false);
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
        navigate("/"); 
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };


  const addReport =() => {}

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    backendUrl,
    logout,
    user,
    loading,
    setUser,
    unreadCount,
    addReport,
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
