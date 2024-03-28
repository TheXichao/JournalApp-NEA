import Cookies from "universal-cookie";
import { User } from "../hooks/useUser";
import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface UserContextType {
  user: User | null;
  updateUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cookies = new Cookies();
  const [user, setUser] = useState<User | null>(() => {
    // prevent my user being lost on refresh
    const savedUser = cookies.get("user");
    if (savedUser) {
      return savedUser;
    }
  });

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    console.log("update user for context: ", newUser, user);
  };

  useEffect(() => {
    if (user) console.log("user context: ", user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
