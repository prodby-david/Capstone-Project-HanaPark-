import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container } from '../../lib/motionConfigs';
import AdminHeader from '../../components/headers/adminHeader';
import DashboardCard from '../../components/cards/dashboardCards';
import { UsersIcon, MapPinIcon, CalendarIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid'
import AdminAPI from '../../lib/inteceptors/adminInterceptor'
import { socket } from '../../lib/socket';


const AdminDashboard = () => {

  const [showSlots, setShowSlots] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [countReservation, setCountReservation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = sessionStorage.getItem('passcode_verified');
    if (!verified) {
      navigate('/admin/passcode'); 
    }
  }, [navigate]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", "admins");

    socket.on("newReservation", (reservation) => {
      console.log("📦 New reservation received:", reservation);
      setNotifications((prev) => [reservation, ...prev]);
    });

    return () => {
      socket.off("newReservation");
      socket.disconnect();
    };
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

        <div className='flex flex-col gap-y-10'>

            <div className='flex items-center justify-between px-10 mt-10'>
                <h2 className='text-xl text-color font-semibold'>System Overview</h2>
            </div>

            <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className='flex justify-between gap-5 px-20'>

                <DashboardCard 
                icon={UsersIcon}
                title={'Total Users'}
                value={countUser.length}
                to={'/users-lists'} 
                />

                <DashboardCard 
                icon={MapPinIcon}
                title={'Parking Slots'}
                value={showSlots.length}
                to={'/admin-dashboard/available-slots'} 
                />

                <DashboardCard 
                icon={CalendarIcon}
                title={'Reservations'}
                value={countReservation.length}
                to={'/reservation/lists'} 
                />

                <DashboardCard 
                icon={ChatBubbleOvalLeftIcon}
                title={'Feedbacks'}
                value={0}
                to={'/feedbacks'} 
                />
                   
            </motion.div>

            {/* ✅ Real-Time Notification Stack */}
              <div className="px-10 mt-10">
                <h2 className="text-lg font-semibold text-color mb-3">Users Activities</h2>
                <div className="bg-white shadow-md rounded-xl p-4 h-72 overflow-y-auto border border-gray-200">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No activities yet.</p>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={index} className="p-3 border-b border-gray-200 text-sm">
                        <p className="font-semibold text-color">
                          {notif.reservedBy?.firstname} {notif.reservedBy?.lastname}
                        </p>
                        <p className="text-gray-600">
                          Reserved slot <strong>{notif.slotId?.slotCode}</strong> for a {notif.vehicleType}.
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

        </div>
    </>
  )
}

export default AdminDashboard;
