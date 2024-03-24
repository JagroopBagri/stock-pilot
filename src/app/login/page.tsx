"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { PropagateLoader } from "react-spinners";



const defaultUserState = { username: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState(defaultUserState);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);

  // on login submit
  const onSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/users/login", user);
      if (response.status === 200) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the submit action inside the modal
  const onForgotPasswordSubmit = async (email: string) => {
    // Implement the API call or logic here to handle the forgot password action
    console.log(email);
    setShowForgotPasswordModal(false); // Close the modal after submission
  };

  useEffect(() => {
    if (user.username.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <>
    <div
      className={
        "flex flex-col items-center justify-center h-screen p-5 w-full"
      }
    >
      <h1 className={"text-2xl my-16"}>Login</h1>
      <label htmlFor={"username"}>Username</label>
      <input
        className={
          "text-black my-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        }
        type={"text"}
        id={"username"}
        placeholder={"Username"}
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <label htmlFor={"password"}>Password</label>
      <input
        className={
          "text-black my-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        }
        type={"password"}
        id={"password"}
        placeholder={"Password"}
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        className={
          "mt-4 border-2 border-white py-2 rounded hover:bg-white hover:text-black p-2 cursor-pointer"
        }
        onClick={onSubmit}
        disabled={buttonDisabled}
      >
        {loading ? <PropagateLoader /> : "Login"}
      </button>
      <Link className={"text-sm mt-6"} href={"/sign-up"}>
        {"Don't have an account? Sign Up"}
      </Link>
      <button className="text-sm mt-4" onClick={() => setShowForgotPasswordModal(true)}>
        Forgot your password?
      </button>
    </div>
    </>
  );
};

