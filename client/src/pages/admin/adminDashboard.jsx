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
                value={feedbacks.length}
                to={'/feedbacks'} 
                />
                   
            </motion.div>

            <div className="flex flex-col items-center justify-center my-5 w-full px-5">
            <div className="w-full max-w-4xl">
              <h2 className="text-lg font-semibold text-color mb-3 text-center relative">
                  Users Activities
              </h2>
              <div className="bg-white shadow-md rounded-xl p-4 h-96 overflow-y-auto border border-gray-200">
                {reservation.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">Loading activities...</p>
                ) : (
                  reservation.map((notif, index) => {
                    const isLatest = index === 0 && unseenCount > 0; 
                    return (
                      <div
                        key={notif._id || index}
                        className="p-3 border-b border-gray-200 text-sm relative"
                      >

                        {isLatest && (
                          <span className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-2 h-2 bg-color-3 rounded-full animate-pulse"></span>
                        )}

                        <p className="font-semibold text-color flex items-center gap-1">
                          {getUserTypeIcon(notif.reservedBy?.userType)}
                          {notif.reservedBy?.firstname} {notif.reservedBy?.lastname}
                        </p>
                        
                        <div className="text-gray-600">
                          {notif.status === 'Pending' && (
                            <>Requested a reservation for slot <span className="font-semibold">{notif.slotCode}</span>. The slot status is now reserved.</>
                          )}

                          {notif.status === 'Reserved' && (
                            <>Confirmed a reservation on slot <span className="font-semibold">{notif.slotCode}</span>. The slot status is now occupied.</>
                          )}

                          {notif.status === 'Cancelled' && (
                            <>Cancelled their reservation. The slot status is now available.</>
                          )}

                          {notif.status === 'Completed' && (
                            <>Completed their reservation on slot <span className="font-semibold">{notif.slotCode}</span>. The slot status is now available.</>
                          )}
                        </div>

                        <p className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    );
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
