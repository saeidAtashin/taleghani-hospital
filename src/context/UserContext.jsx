import React, { createContext, useContext, useState } from "react";

// Define the UserContext without TypeScript types
const UserContext = createContext(undefined);

export { UserContext };

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const value = { userData, setUserData };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
