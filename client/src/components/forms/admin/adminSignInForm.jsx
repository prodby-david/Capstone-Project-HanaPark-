import React, { useState } from "react";
import { toast } from "react-toastify";
import toastOptions from "../../../lib/toastConfig";
import { useAdminContext } from "../../../context/adminContext";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../../../lib/inteceptors/adminInterceptor";
import Loader from "../../loaders/loader";
import CustomPopup from "../../popups/CustomPopup"; // ✅ Import your popup

const AdminSignInForm = () => {
  const [adminData, setAdminData] = useState({
    adminusername: "",
    adminpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const navigate = useNavigate();
  const { Login } = useAdminContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const openPopup = (title, message, type = "info", onConfirm = null) => {
    setPopup({ show: true, title, message, type, onConfirm });
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.adminusername) {
      toast.error("Admin username is required.", toastOptions);
      return;
    }

    if (!adminData.adminpassword) {
      toast.error("Admin password is required.", toastOptions);
      return;
    }

    try {
      setLoading(true);
      const res = await AdminAPI.post("/admin/sign-in", adminData);

      if (res.data.success) {
        Login({ verified: true });
        openPopup(
          "Credentials Valid",
          res.data.message,
          "success",
          () => navigate("/admin-dashboard")
        );
      }
    } catch (err) {
      if (err.response && err.response.data) {
        openPopup(
          "Sign in failed",
          err.response.data.message || "An error occurred",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="flex flex-col items-center justify-center gap-y-5 p-10 shadow-md shadow-color-2 w-full max-w-sm">
          <h2 className="font-semibold text-color text-xl">Admin Sign In</h2>

          <form className="w-full">
            <div className="flex flex-col gap-y-3">
              <input
                type="text"
                className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
                name="adminusername"
                value={adminData.adminusername}
                onChange={handleChange}
                placeholder="Admin Username"
              />

              <input
                type="password"
                className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
                name="adminpassword"
                value={adminData.adminpassword}
                onChange={handleChange}
                placeholder="Admin Password"
              />

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-900 hover:to-blue-500 transition duration-300 cursor-pointer text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <Loader />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onConfirm={
          popup.onConfirm
            ? () => {
                closePopup();
                popup.onConfirm();
              }
            : closePopup
        }
        confirmText="Confirm"
      />
    </>
  );
};

export default AdminSignInForm;
