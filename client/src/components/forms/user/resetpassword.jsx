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
      setIsLoading(true)

      try {
        const response = await api.post(`/reset-password/${token}`, {
          password,
        });

        Swal.fire('Success', response.data.message, 'success');
        navigate('/sign-in' , { replace: true });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to reset password', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>

        {isLoading ? <Loader text='Resetting your password...'/> : null}
        
      </div>

      
    );
  };

  export default ResetPassword;
