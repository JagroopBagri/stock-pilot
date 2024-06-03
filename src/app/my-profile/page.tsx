"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "@/components/Store";


export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const {user, setUser} = useContext(UserContext) as UserContextType;

  const logout = async () => {
    try {
      await axios.get("/api/v1/user/logout");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error("Error occurred while attempting to logout");
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/v1/user/profile");
    console.log(res.data);
    setData(res.data.data._id);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/my-profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        GetUser Details
      </button>
    </div>
  );
}
