import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import toastOptions from "../../lib/toastConfig";
import { useAuth } from "../../context/authContext";
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import UserAPI from "../../lib/inteceptors/userInterceptor";
import Loader from "../../components/loaders/loader";
import { motion } from "framer-motion";

const SignIn = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username) {
      toast.error("Username should not be empty.", toastOptions);
      return;
    }
    if (!userData.password) {
      toast.error("Password should not be empty.", toastOptions);
      return;
    }

    setIsLoading(true);

    try {
      const res = await UserAPI.post("/sign-in", userData);

      if (res.data.success) {
        Swal.fire({
          title: res.data.message,
          text: "Press confirm to continue.",
          icon: "success",
          confirmButtonColor: "#00509e",
          confirmButtonText: "Confirm",
        }).then(() => {
          setAuth({ user: res.data.user });
          navigate("/dashboard");
        });

        setUserData({ username: "", password: "" });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        Swal.fire({
          title: "Sign in failed",
          text: err.response.data.message || "An error occurred",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen">

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center items-start text-white bg-gradient-to-br from-blue-600 to-blue-800 w-1/2 h-full p-12 rounded-r-3xl shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to HanaPark</h1>
          <p className="text-lg opacity-90 mb-8">
            Smart Availability & Reservation in Real-Time exclusively for STI College Global City.
          </p>
          <p className="text-sm text-blue-100">
            Manage your parking slots conveniently with a secure, modern platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center w-full lg:w-1/2 px-6 py-12"
        >
          <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-color mb-1">Sign In</h2>
              <p className="text-sm text-gray-600">Access your HanaPark account</p>
            </div>

            <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  name="username"
                  onChange={handleChange}
                  value={userData.username}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
                  placeholder="Username"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  onChange={handleChange}
                  value={userData.password}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
                  placeholder="Password"
                />
                {showPassword ? (
                  <EyeIcon
                    className="absolute right-3 top-2.5 w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={togglePassword}
                  />
                ) : (
                  <EyeSlashIcon
                    className="absolute right-3 top-2.5 w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={togglePassword}
                  />
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium py-2.5 rounded-md hover:from-blue-800 hover:to-blue-600 transition-all duration-300 shadow-md cursor-pointer"
              >
                Sign In
              </button>

              {/* Forgot Password */}
              <div className="text-center mt-2">
                <Link
                  to="/reset-password"
                  className="text-sm text-blue-700 hover:underline hover:text-blue-900 transition"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              © {new Date().getFullYear()} HanaPark. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {isLoading && <Loader text="Signing in..." />}
    </>
  );
};

export default SignIn;
