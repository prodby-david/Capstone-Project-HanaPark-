import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../loaders/loader';
import { api } from '../../../lib/api';
import CustomPopup from '../../popups/popup';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
  });

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return setPopup({
        show: true,
        type: 'error',
        title: 'Invalid Password',
        message: 'Password must be at least 6 characters long.',
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    }

    if (password !== confirmPassword) {
      return setPopup({
        show: true,
        type: 'error',
        title: 'Password Mismatch',
        message: 'Passwords do not match.',
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      setPopup({
        show: true,
        type: 'success',
        title: 'Password Reset',
        message: response.data.message,
        onConfirm: () => {
          setPopup({ ...popup, show: false });
          navigate('/sign-in', { replace: true });
        },
      });
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: 'error',
        title: 'Failed to Reset',
        message: err.response?.data?.message || 'Something went wrong.',
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <form
        onSubmit={handleReset}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col gap-4"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-center text-color-3 mb-2">
          Reset Password
        </h2>
        <p className="text-color-2 text-sm text-center mb-4">
          Please enter your new password below.
        </p>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-3 hover:bg-blue-700 active:scale-[0.98] cursor-pointer transition-all duration-200"
        >
          Reset Password
        </button>
      </form>

      {isLoading && <Loader text="Resetting your password..." />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
        onConfirm={popup.onConfirm}
      />
    </div>
  );
};

export default ResetPassword;
