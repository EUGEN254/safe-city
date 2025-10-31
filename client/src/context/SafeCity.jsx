import { createContext, useContext, useState } from "react";

export const SafeCityContext = createContext(null);

export const SafeCityContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; 
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const value = {
    backendUrl,
    user, // Added user to context value
    setUser,
    fetchCurrentUser,
  };
  
  return (
    <SafeCityContext.Provider value={value}>
      {props.children} {/* Fixed typo: childreb → children */}
    </SafeCityContext.Provider>
  );
};

export const useSafeCity = () => {
  const context = useContext(SafeCityContext);
  if (!context) {
    throw new Error("useSafeCity must be used within a SafeCityContextProvider"); 
  }
  return context;
};