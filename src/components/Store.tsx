"use client"
import React, { useState, createContext, useEffect } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import { toast } from "react-hot-toast";

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

type Props = {
  children: JSX.Element;
};

export default function Store({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/v1/user/profile");
      if (response.data && response.data.data) {
        setUser(response.data.data);
      }
    } catch (error:any) {
      if(error.response.data.error === "Unauthorized") return
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
