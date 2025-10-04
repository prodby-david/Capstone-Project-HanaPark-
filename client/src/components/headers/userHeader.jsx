import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { socket } from '../../lib/socket'

const UserHeader = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!auth.user?._id) return;
    const userId = auth.user._id.toString();

    // ✅ If socket is already connected, join immediately
    if (socket.connected) {
      socket.emit("joinUser", userId);
      console.log("Joined user room immediately:", userId);
    }

    // ✅ Re-join on reconnect
    const handleConnect = () => {
      socket.emit("joinUser", userId);
      console.log("Joined user room on reconnect:", userId);
    };
    socket.on("connect", handleConnect);

    // ✅ Fetch existing notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();

    // ✅ Handle new notification from backend
    const handleNotification = (notif) => {
      console.log("SOCKET RECEIVED:", notif);
      setNotifications((prev) => [notif, ...prev]);
    };
    socket.on("reservationCancelledByAdmin", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("reservationCancelledByAdmin", handleNotification);
    };
  }, [auth.user]);

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <h1 className="text-xl font-bold">User Dashboard</h1>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-500 text-sm">
                  No notifications yet
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
