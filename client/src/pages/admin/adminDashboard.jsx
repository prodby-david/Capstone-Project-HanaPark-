import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container } from '../../lib/motionConfigs';
import AdminHeader from '../../components/headers/adminHeader';
import DashboardCard from '../../components/cards/dashboardCards';
import { UsersIcon, MapPinIcon, CalendarIcon, ChatBubbleOvalLeftIcon, UserIcon, AcademicCapIcon, IdentificationIcon } from '@heroicons/react/24/solid'
import AdminAPI from '../../lib/inteceptors/adminInterceptor'
import { socket } from '../../lib/socket';
import UserFooter from '../../components/footers/userFooter';


const AdminDashboard = () => {

  const [showSlots, setShowSlots] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [countReservation, setCountReservation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = sessionStorage.getItem('passcode_verified');
    if (!verified) {
      navigate('/admin/passcode'); 
    }
  }, [navigate]);

  const getUserTypeIcon = (type) => {
  switch (type) {
    case 'Student':
      return <AcademicCapIcon className="w-5 h-5 text-blue-500 inline mr-1" />;
    case 'Staff':
      return <IdentificationIcon className="w-5 h-5 text-green-500 inline mr-1" />;
    default:
      return <UserIcon className="w-5 h-5 text-gray-400 inline mr-1" />;
  }
};

  useEffect(() => {
  const fetchActivities = async () => {
  try {
    const res = await AdminAPI.get('/admin/activities');
    setReservation(res.data); 
    } catch (err) {
      console.error("Error fetching activities:", err.response?.data || err.message);
    }
  };

  fetchActivities();
  socket.emit("joinAdmin");

  socket.on("reservationCreated", (reservation) => {
    setReservation((prev) => [reservation, ...prev]);
    setUnseenCount(prev => prev + 1); 
  });

  socket.on("reservationCancelled", (reservation) => {
    setReservation((prev) => [reservation, ...prev]);
    setUnseenCount(prev => prev + 1); 
  });

   socket.on("reservationCancelledByUser", (activity) => {
    setReservation((prev) => [activity, ...prev]); 
    setUnseenCount(prev => prev + 1);
  });



  return () => {
    socket.off("reservationCreated");
    socket.off("reservationCancelled");
    socket.off('reservationCancelledByUser');
  };
}, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await AdminAPI.get("/admin/feedbacks");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, []);



   useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await AdminAPI.get('/admin/slots', {withCredentials: true});
        setShowSlots(res.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };

    fetchSlots();
  }, []);

  useEffect(() => {
    const countUsers = async () => {
      try {
        const res = await AdminAPI.get('/admin/users', {withCredentials: true});
        const activeUsers = res.data.filter(user => user.status === 'Active');
        setCountUser(activeUsers);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };

    countUsers();
  }, []);

  useEffect(() => {
    const getReservation = async () => {
      try {
        const res = await AdminAPI.get('/admin/reservations');
        setCountReservation(res.data); 
      } catch (err) {
        console.error("Error fetching reservations:", err.response?.data || err.message);

      }
    }
    getReservation();
  }, [])

   

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col gap-y-12 px-8 lg:px-16 py-10 min-h-screen">
        <div className="flex items-center justify-between border-b border-color-2 pb-4">
          <h2 className="text-3xl font-bold text-color">System Overview</h2>
          <p className="text-gray-500 text-sm">Admin Dashboard</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <DashboardCard icon={UsersIcon} title="Total Users" value={countUser.length} to="/users-lists" />
          <DashboardCard icon={MapPinIcon} title="Parking Slots" value={showSlots.length} to="/admin-dashboard/available-slots" />
          <DashboardCard icon={CalendarIcon} title="Reservations" value={countReservation.length} to="/reservation/lists" />
          <DashboardCard icon={ChatBubbleOvalLeftIcon} title="Feedbacks" value={feedbacks.length} to="/feedbacks" />
        </motion.div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-color-2 bg-gradient-to-r from-[#3366CC]/10 to-[#9460C9]/10">
              <h2 className="text-lg font-semibold text-gray-800">Recent User Activities</h2>
              <span className="text-sm text-gray-500">({reservation.length} activities)</span>
            </div>

            <div className="p-5 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              {reservation.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No recent activities to display.</p>
              ) : (
                reservation.map((notif, index) => {
                  const isLatest = index === 0 && unseenCount > 0
                  return (
                    <motion.div
                      key={notif._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative p-4 border-b border-gray-100 hover:bg-gray-50 rounded-xl transition"
                    >
                      {isLatest && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3366CC] rounded-full animate-pulse"></span>
                      )}
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {getUserTypeIcon(notif.reservedBy?.userType)}
                        {notif.reservedBy?.firstname} {notif.reservedBy?.lastname}
                      </p>
                      <div className="text-gray-600 mt-1">
                        {notif.status === "Pending" && (
                          <>Requested a reservation for slot <span className="font-semibold text-[#3366CC]">{notif.slotCode}</span>. The slot status is now reserved.</>
                        )}
                        {notif.status === "Reserved" && (
                          <>Confirmed a reservation on slot <span className="font-semibold text-[#3366CC]">{notif.slotCode}</span>. The slot status is now occupied.</>
                        )}
                        {notif.status === "Cancelled" && (
                          <>Cancelled their reservation. Slot <span className="font-semibold text-[#3366CC]">{notif.slotCode}</span> is now available.</>
                        )}
                        {notif.status === "Completed" && (
                          <>Completed their reservation on slot <span className="font-semibold text-[#3366CC]">{notif.slotCode}</span>. The slot is now available.</>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </>
  )
}

export default AdminDashboard;
