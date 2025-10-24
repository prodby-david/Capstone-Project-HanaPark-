import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import toastOptions from "../../../lib/toastConfig";
import { api } from "../../../lib/api";
import CustomPopUp from "../../popups/popup";

const CreateAdminAccount = () => {
  const [adminData, setAdminData] = useState({
    adminusername: "",
    adminpassword: "",
    adminconfirmpassword: "",
  });

  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
    onConfirm: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.adminusername || !adminData.adminpassword) {
      toast.error("Fields should not be empty.", toastOptions);
      return;
    }

    if (adminData.adminconfirmpassword !== adminData.adminpassword) {
      toast.error("Password doesn't match. Try again.", toastOptions);
      return;
    }

    try {
      const res = await api.post("/admin/account", adminData);

      if (res.data.success) {
        setPopup({
          visible: true,
          title: "Sign in successful",
          message: "Press Confirm to continue.",
          type: "success",
          onConfirm: () => navigate("/admin/sign-in"),
        });
      }
    } catch (err) {
      setPopup({
        visible: true,
        title: "Registration failed",
        message: err.response?.data?.message || "Something went wrong.",
        type: "error",
        onConfirm: () => setPopup({ ...popup, visible: false }),
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-5">
        <div className="flex flex-col items-center justify-center gap-y-5 shadow-sm shadow-color-3 rounded-md p-10 w-full max-w-md">
          <h2 className="text-center font-semibold text-color text-2xl">
            Admin Registration
          </h2>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-3">
              <div>
                <label
                  htmlFor="AdminUsername"
                  className="text-color-3 font-semibold"
                >
                  Admin Username
                </label>
                <input
                  type="text"
                  name="adminusername"
                  id="AdminUsername"
                  value={adminData.adminusername}
                  onChange={handleChange}
                  className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="AdminPassword"
                  className="text-color-3 font-semibold"
                >
                  Admin Password
                </label>
                <input
                  type="password"
                  name="adminpassword"
                  id="AdminPassword"
                  value={adminData.adminpassword}
                  onChange={handleChange}
                  className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="AdminConfirmPassword"
                  className="text-color-3 font-semibold"
                >
                  Confirm Admin Password
                </label>
                <input
                  type="password"
                  name="adminconfirmpassword"
                  id="AdminConfirmPassword"
                  value={adminData.adminconfirmpassword}
                  onChange={handleChange}
                  className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-3 rounded-md hover:from-blue-900 hover:to-blue-500 transition duration-700 cursor-pointer text-sm"
              >
                Register Admin Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <CustomPopUp
            show={popup.visible}
            title={popup.title}
            message={popup.message}
            type={popup.type}
            onConfirm={popup.onConfirm}
            showCancel={false}
            onClose={() => setPopup(prev => ({ ...prev, visible: false }))}
            confirmText="Confirm"
        />

    </>
  );
};

export default CreateAdminAccount;
