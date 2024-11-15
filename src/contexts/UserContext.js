import React, { createContext, useState, useContext } from "react";

// Create context
const UserContext = createContext();

// Create provider component
export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the user context
export const useUser = () => useContext(UserContext);
