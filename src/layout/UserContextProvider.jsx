import React, { useState } from "react";
import { UserContext } from "../context/UserContext";

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const value = { userData, setUserData };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
