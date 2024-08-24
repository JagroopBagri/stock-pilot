"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { UserContext, UserContextType } from "@/components/Store";

const defaultFormValues = { username: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [fpModalOpen, setFPModalOpen] = useState<boolean>(false);
  const fpModalRef = useRef<HTMLDialogElement>(null);
  const {user, setUser} = useContext(UserContext) as UserContextType;

  // on login submit
  const onSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/user/login", formValues);
      if (response.status === 200) {
        setUser(response.data.user);
        console.log("response is", response);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error("Error: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the submit action inside the modal
  const onForgotPasswordSubmit = async (email: string) => {
    setLoading(true);
    try {
      await axios.post("/api/v1/user/forgot-password", { email });
      setFPModalOpen(false);
      setForgotEmail("");
      toast.success(
        "Reset password email has been sent! Please check your email!"
      );
    } catch (error: any) {
      toast.error("Error: Could not send reset password email");
      console.error(error?.response?.data);
    }
    setLoading(false);
  };

  // This function is used to open the forgot password modal
  const toggleForgotPasswordModal = () => {
    setFPModalOpen(!fpModalOpen);
  };

  useEffect(() => {
    if (fpModalOpen) {
      fpModalRef.current !== null && fpModalRef.current.showModal();
    } else {
      if (
        fpModalRef.current &&
        typeof fpModalRef.current.close === "function"
      ) {
        fpModalRef.current.close();
      }
    }
  }, [fpModalOpen]);

  return (
    <>
      <div className={"flex flex-col items-center h-screen p-5 w-full mt-52"}>
        <h1 className={"text-8xl mb-20"}>Stock Pilot</h1>
        <input
          className="input input-bordered w-full max-w-xs mb-6"
          type={"text"}
          id={"username"}
          placeholder={"Username"}
          value={formValues.username}
          onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
        />

        <input
          className="input input-bordered w-full max-w-xs mb-6"
          type={"password"}
          id={"password"}
          placeholder={"Password"}
          value={formValues.password}
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
        />
        <button className={"btn bg-success"} onClick={onSubmit}>
          {loading ? <PropagateLoader /> : "Login"}
        </button>
        <Link className={"mb-6 mt-8 link-primary"} href={"/sign-up"}>
          {"Don't have an account? Sign Up"}
        </Link>

        <p
          className="link-primary cursor-pointer"
          onClick={toggleForgotPasswordModal}
        >
          Forgot your password?
        </p>
        <dialog id="forgot_password_modal" className="modal" ref={fpModalRef}>
          <div className="modal-box">
            <form
              method="dialog"
              className="w-full flex flex-col items-center"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                onForgotPasswordSubmit(forgotEmail);
              }}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={(event) => {
                  event.preventDefault();
                  toggleForgotPasswordModal();
                }}
              >
                ✕
              </button>
              <h2 className="font-bold text-2xl text-center mb-6">
                Recover your account
              </h2>
              <p className="mb-6">Please enter your email below</p>
              <input
                className="input input-bordered w-full max-w-xs mb-6"
                type="email"
                id="forgot-email"
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <div className="flex gap-6">
                <button
                  type="button"
                  className="btn bg-error"
                  onClick={(event) => {
                    event.preventDefault();
                    toggleForgotPasswordModal();
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="btn bg-success">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
}
