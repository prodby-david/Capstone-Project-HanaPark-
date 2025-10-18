import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { publicApi } from "../../lib/api";
import Loader from "../../components/loaders/loader";
import CustomPopup from "../../components/popups/popup";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await publicApi.post("/reset-password", { email });
      setPopup({
        show: true,
        type: "success",
        title: "Email Sent!",
        message: res.data.message,
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
      setEmail("");
    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        title: "Reset Failed",
        message: err.response?.data?.message || "Something went wrong.",
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
        >
          <div className="flex flex-col items-center text-center gap-y-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <EnvelopeIcon className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-color">
              Forgot Your Password?
            </h2>
            <p className="text-sm text-gray-500 max-w-xs">
              Enter your registered email address, and we’ll send you a link to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="flex flex-col text-left">
              <label
                htmlFor="Reset-email"
                className="text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  id="Reset-email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="samplemail@gmail.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-md text-sm font-semibold shadow-md hover:from-blue-800 hover:to-blue-600 transition duration-300 cursor-pointer"
            >
              Send Reset Instructions
            </motion.button>
          </form>

          <div className="mt-6 text-sm">
            <Link
              to="/sign-in"
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Remembered Your Password?
            </Link>
          </div>
        </motion.div>
      </div>

      {isLoading && (
        <Loader text="Sending reset instructions to your email..." />
      )}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
        onConfirm={popup.onConfirm}
      />
    </>
  );
};

export default ForgotPassword;
