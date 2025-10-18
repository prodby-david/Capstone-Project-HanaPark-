import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ArrowLeftStartOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import { socket } from '../../lib/socket';
import Loader from '../../components/loaders/loader';
import CustomPopup from '../popups/popup';

const UserHeader = () => {
  const { logout, auth } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    if (!auth.user?.userId) return;
    const userId = auth.user.userId.toString();

    socket.emit("joinUser", userId);

    const fetchNotifications = async () => {
      try {
        const res = await UserAPI.get('/notifications');
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();

    const handleNotification = (notif) => {
      setNotifications(prev => [notif, ...prev]);
    };

    socket.on("cancelledReservationByAdmin", handleNotification);
    socket.on("reservationApproved", handleNotification);
    socket.on("reservationVerified", handleNotification);
    socket.on("reservationCompleted", handleNotification);

    return () => {
      socket.off("cancelledReservationByAdmin", handleNotification);
      socket.off("reservationApproved", handleNotification);
      socket.off("reservationVerified", handleNotification);
      socket.off("reservationCompleted", handleNotification);
    };
  }, [auth.user]);

  const toggleNotif = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) {
      try {
        await UserAPI.patch('/notifications/mark-all-read');
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    setPopup({
      show: true,
      type: 'warning',
      title: 'Ready to Leave?',
      message: 'This action will sign you out.',
      onConfirm: async () => {
        setPopup({ ...popup, show: false });
        setIsLoading(true);
        try {
          await UserAPI.post('/logout', {});
          logout();
          setPopup({
            show: true,
            type: 'success',
            title: 'Logged out!',
            message: 'You have been logged out successfully.',
            onConfirm: () => {
              setPopup({ ...popup, show: false });
              setTimeout(() => {
                setIsLoading(false);
                navigate('/');
              }, 500);
            },
          });
        } catch (err) {
          setIsLoading(false);
          setPopup({
            show: true,
            type: 'error',
            title: 'Logging out failed.',
            message: 'Please try again.',
            onConfirm: () => setPopup({ ...popup, show: false }),
          });
        }
      },
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="flex justify-between items-center py-3 px-5 bg-white shadow-md relative z-50">

        <Link to="/dashboard" className="font-bold text-lg text-color tracking-wide">
          HanaPark
        </Link>

        <div className="flex items-center gap-x-3 md:gap-x-5">

          <div className="relative">
            <button
              onClick={toggleNotif}
              className="relative flex items-center justify-center gap-1 text-sm text-color-3 hover:text-color transition cursor-pointer"
            >
              <BellIcon className="w-6 h-6" />
              <span className="hidden sm:inline font-medium">Notifications</span>

              {unreadCount > 0 && (
                <span className="absolute -top-1 left-3 bg-red-500 text-white text-[10px] px-1.5 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-color-3 hover:text-color transition cursor-pointer"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Log out</span>
          </button>
        </div>

        <AnimatePresence>
          {notifOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 bg-black z-40"
              />

              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="fixed top-16 right-3 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden backdrop-blur-md"
              >
                <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-sm font-semibold text-color-3">Notifications</h3>
                  <span className="text-xs text-gray-400">{notifications.length} total</span>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-5 text-center text-gray-500 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map((notif) => (
                      <motion.div
                        key={notif._id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 border-b border-gray-100 transition ${notif.read ? "bg-white" : "bg-blue-50"}`}
                      >
                        <p className="text-gray-800 text-sm leading-snug">{notif.message}</p>
                        <span className="text-xs text-gray-400 block mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {isLoading ? <Loader /> : null}
      </div>

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

export default UserHeader;
