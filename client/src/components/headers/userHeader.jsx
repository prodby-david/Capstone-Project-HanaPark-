import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { ArrowLeftStartOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import { socket } from '../../lib/socket';

const UserHeader = () => {
  const { logout, auth } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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
          await UserAPI.post('/logout', {});
          logout();
          navigate('/');
        });
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex justify-between items-center py-3 px-5 bg-white shadow-md relative">

      <Link to="/dashboard" className="font-bold text-lg text-color">
        HanaPark
      </Link>

      <div className="flex items-center gap-x-1 md:gap-x-3">

        <div className="relative">
          <button
            onClick={toggleNotif}
            className="flex items-center justify-center text-xs text-color-3 hover:text-color cursor-pointer group"
          >
            <BellIcon className="w-5 h-5 text-color-3 group-hover:text-color" />
            <span className="hidden sm:inline">Notifications</span>
          </button>

          {unreadCount > 0 && (
            <span className="absolute -top-1 left-3 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center text-xs text-color-3 hover:text-color cursor-pointer group"
        >
          <ArrowLeftStartOnRectangleIcon className="w-5 h-5 text-color-3 group-hover:text-color" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setNotifOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl z-50 overflow-hidden fixed top-16 right-3 w-[90%] max-w-sm h-[60vh] sm:h-auto sm:w-80 rounded-xl"
            >
              <div className="p-4 border-b border-color-2 font-semibold text-sm text-gray-700 flex justify-between">
                Notifications
                <span className="text-xs text-gray-400">{notifications.length} total</span>
              </div>
              <div className="max-h-full sm:max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-color-3 text-center">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-4 text-sm border-b border-color-3 hover:bg-gray-50 transition ${
                        !notif.read ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <p className="text-color-3">{notif.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHeader;
