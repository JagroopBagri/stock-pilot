"use client";
import { useState, useEffect } from "react";
import { useRouter} from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import ToggleTheme from "@/components/ToggleTheme";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const resetToken = searchParams ? searchParams.get("reset_token") : null;

  // Function to handle the password update submission
  const onUpdatePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/v1/user/reset-password", {
        token: resetToken,
        password,
      });
      toast.success("Your password has been updated successfully.");
      setPassword("");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        "Failed to update password. This link may have expired. Please request another reset-password email and try again."
      );
      console.error(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center h-screen p-5 w-full mt-52">
        <ToggleTheme />
        <h1 className="text-8xl mb-20">Stock Pilot</h1>
        <form
          className="flex flex-col items-center w-full max-w-xs"
          onSubmit={onUpdatePasswordSubmit}
        >
          <input
            className="input input-bordered w-full mb-6"
            type="password"
            placeholder="Enter a new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn bg-success" type="submit" disabled={!password}>
            {loading ? <PropagateLoader /> : "Update Password"}
          </button>
          <Link href="/login" className="link-primary mt-6">
            Go to Login
          </Link>
        </form>
      </div>
  );
}
