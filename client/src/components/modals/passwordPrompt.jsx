import React, { useState } from 'react';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/adminContext';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import Loader from '../loaders/loader';
import CustomPopup from '../popups/popup';

const PasswordPrompt = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  const navigate = useNavigate();
  const { verifyPasscode } = useAdminContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Password should not be empty.', toastOptions);
      return;
    }

    setIsLoading(true);

    try {
      const res = await AdminAPI.post('/admin/passcode-verification', { password });

      if (res.data.success) {
        setPopup({
          show: true,
          type: 'success',
          title: 'Passcode Validated',
          message: res.data.message,
          onConfirm: () => {
            verifyPasscode();
            navigate('/admin/sign-in');
            setPopup({ ...popup, show: false });
          },
        });
      }
    } catch (err) {
      setPopup({
        show: true,
        type: 'error',
        title: 'Validation Failed',
        message: err.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-5">
        <div className="flex flex-col items-center justify-center gap-y-3 w-full max-w-sm shadow-md shadow-color-2 p-10 rounded-xl bg-white">
          <h2 className="text-lg text-color font-semibold">Admin Access</h2>

          <form className="w-full">
            <div className="flex flex-col gap-y-3">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full"
              />

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-color-3 text-white p-2 rounded-md hover:opacity-90 transition duration-300 cursor-pointer text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoading && <Loader text="Validating admin passcode..." />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
        showCancel={false}
        onConfirm={popup.onConfirm}
      />
    </>
  );
};

export default PasswordPrompt;
