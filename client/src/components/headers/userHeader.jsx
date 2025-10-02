import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { socket } from '../../lib/socket'

const UserHeader = () => {
  const { logout, auth } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userId = auth.user?._id.toString();
  useEffect(() => {
  if (!userId) return;

  socket.emit("joinUser", userId);
  console.log("Joining room:", userId);

  const handleNotification = (notif) => {
    console.log("Notification received:", notif);
    setNotifications(prev => [notif, ...prev]);
  };

  socket.on("reservationCancelledByAdmin", handleNotification);

  return () => {
    socket.off("reservationCancelledByAdmin", handleNotification);
  };
}, [userId]);




  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleNotif = () => setNotifOpen(!notifOpen);

  const handleLogout = () => {
    Swal.fire({
      title: 'Ready to Leave?',
      text: "This action will sign you out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00509e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(async () => {
          await api.post('/logout', {});
          logout();
        });
      }
    });
  };

  return (
    <>
      <div className='flex justify-between items-center py-4 px-6 bg-white shadow-md'>
        {/* Logo */}
        <div className='flex items-center gap-x-px text-color'>
          <Link to={'/dashboard'} className='font-bold text-sm md:text-md'>
            HanaPark
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <Bars3Icon
          onClick={toggleMenu}
          className="w-6 h-6 text-color-3 cursor-pointer md:hidden"
        />

        {/* Desktop Menu */}
        <div className={`flex-col md:flex md:flex-row md:items-center md:gap-x-5 ${isOpen ? 'flex' : 'hidden'} absolute top-14 left-0 w-full bg-white shadow-md md:static md:w-auto md:shadow-none transition ease-in-out`}>
          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center absolute top-1 left-0 w-full bg-white shadow-md md:hidden text-color-3"
              >
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="p-5 flex items-center gap-2 cursor-pointer hover:text-color"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop right-side actions */}
          <div className='hidden md:flex items-center gap-x-4'>
            {/* Notifications */}
            <div className="relative">
              <BellIcon
                onClick={toggleNotif}
                className="w-6 h-6 text-color-3 cursor-pointer hover:text-color"
              />
              {/* Red dot for new notifications */}
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50"
                  >
                    <div className="p-3 border-b font-semibold text-sm text-gray-600">
                      Notifications
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-3 text-sm text-gray-400">No new notifications</div>
                      ) : (
                        notifications.map((notif, index) => (
                          <div
                            key={index}
                            className="p-3 text-sm border-b last:border-none hover:bg-gray-100"
                          >
                            {notif.message || notif}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className='cursor-pointer hover:text-color text-sm md:text-md text-color-3'
            >
              <ArrowLeftStartOnRectangleIcon
                title='Logout'
                className="w-5 h-5 text-color-3 hover:text-color cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
