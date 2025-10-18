import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../loaders/loader';
import { api } from '../../../lib/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return Swal.fire('Error', 'Password must be at least 6 characters long.', 'error');
    }

    if (password !== confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match.', 'error');
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      Swal.fire('Success', response.data.message, 'success');
      navigate('/sign-in', { replace: true });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <form
        onSubmit={handleReset}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col gap-4 transition-transform duration-200 hover:scale-[1.01]"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 text-sm text-center mb-4">
          Please enter your new password below.
        </p>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-3 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
        >
          Reset Password
        </button>
      </form>

      {isLoading && <Loader text="Resetting your password..." />}
    </div>
  );
};

export default ResetPassword;
