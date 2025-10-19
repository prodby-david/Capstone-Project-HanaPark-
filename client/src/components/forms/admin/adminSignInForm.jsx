import React, { useState } from 'react'
import { toast } from 'react-toastify';
import toastOptions from '../../../lib/toastConfig';
import { useAdminContext } from "../../../context/adminContext";
import { useNavigate } from 'react-router-dom';
import AdminAPI from '../../../lib/inteceptors/adminInterceptor';
import Loader from '../../loaders/loader';

const AdminSignInForm = () => {
  const [adminData, setAdminData] = useState({
    adminusername: '',
    adminpassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: '', message: '', type: 'success', onConfirm: null });
  
  const navigate = useNavigate();
  const { Login } = useAdminContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const openPopup = (title, message, type = 'success', onConfirm = null) => {
    setPopup({ show: true, title, message, type, onConfirm });
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminData.adminusername) {
      toast.error('Admin username is required.', toastOptions);
      return;
    }

    if (!adminData.adminpassword) {
      toast.error('Admin password is required.', toastOptions);
      return;
    }

    try {
      setLoading(true);
      const res = await AdminAPI.post('/admin/sign-in', adminData);

      if (res.data.success) {
        Login({ verified: true });
        openPopup(
          'Credentials Valid',
          res.data.message,
          'success',
          () => navigate('/admin-dashboard')
        );
      }
    } catch (err) {
      if (err.response && err.response.data) {
        openPopup(
          'Sign in failed',
          err.response.data.message || 'An error occurred',
          'error'
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

      {/* ✅ Custom Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3
              className={`text-lg font-bold mb-3 ${
                popup.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {popup.title}
            </h3>
            <p className="text-gray-700 mb-5">{popup.message}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  closePopup();
                  if (popup.onConfirm) popup.onConfirm();
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  popup.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSignInForm;
