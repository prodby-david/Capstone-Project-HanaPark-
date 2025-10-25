import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/adminContext';
import { api } from '../../lib/api';
import Loader from './../../components/loaders/loader';
import CustomPopup from '../popups/popup';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { Logout } = useAdminContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    setPopup({
      show: true,
      type: 'warning',
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      onConfirm: confirmLogout,
    });
  };

  const confirmLogout = async () => {
    setPopup({ show: false });
    setIsLoading(true);

    try {
      await api.post('/admin/logout', {});
      Logout();
      setTimeout(() => {
        setIsLoading(false);
        setPopup({
          show: true,
          type: 'success',
          title: 'Logged Out',
          message: 'You have been successfully logged out.',
          onConfirm: () => navigate('/admin/passcode'),
        });
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setPopup({
        show: true,
        type: 'error',
        title: 'Logout Failed',
        message: 'An unexpected error occurred. Please try again.',
        onConfirm: () => setPopup({ show: false }),
      });
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-10 py-3 bg-color text-white">
        <Link to="/admin-dashboard" className="text-xl font-bold">
          HanaPark Admin
        </Link>

        <div className="flex gap-x-5 text-sm items-center">
          <Link to="/admin/student-registration" className="hover:text-color-3 font-semibold">
            Create User
          </Link>

          <Link to="/admin/slots" className="hover:text-color-3 font-semibold">
            Create Slots
          </Link>

          <Link to='/inquiries' className="hover:text-color-3 font-semibold">
            Inquiries
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-color-3 font-semibold cursor-pointer"
            >
              Settings
            </button>

            {isOpen && (
              <div className="absolute top-5 -right-8 mt-2 w-40 bg-white text-color-2 text-center shadow-md z-50 rounded-md">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-center cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isLoading && <Loader text="Logging out..." />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        onClose={() => setPopup({ show: false })}
      />
    </>
  );
};

export default AdminHeader;
