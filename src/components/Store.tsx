"use client"
import React, { useState, createContext, useEffect } from "react";
import { users } from "@prisma/client";

export type UserContextType = {
  user: users | null;
  setUser: (user: users | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

type Props = {
  children: JSX.Element;
};

export default function Store({ children }: Props) {
  const [user, setUser] = useState<users | null>(null);

  useEffect(() => {
    console.log("user is", user)
  }, [user])
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
