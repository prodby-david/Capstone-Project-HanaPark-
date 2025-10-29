import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container } from '../../lib/motionConfigs';
import AdminHeader from '../../components/headers/adminHeader';
import DashboardCard from '../../components/cards/dashboardCards';
import { 
  UsersIcon, MapPinIcon, CalendarIcon, ChatBubbleOvalLeftIcon, 
  UserIcon, AcademicCapIcon, IdentificationIcon 
} from '@heroicons/react/24/solid';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import { socket } from '../../lib/socket';
import UserFooter from '../../components/footers/userFooter';

const AdminDashboard = () => {
  const [showSlots, setShowSlots] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [countReservation, setCountReservation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = sessionStorage.getItem('passcode_verified');
    if (!verified) navigate('/admin/passcode');
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
    const fetchData = async () => {
      try {
        const [
          activitiesRes, 
          userLogsRes, 
          feedbacksRes, 
          slotsRes, 
          usersRes, 
          reservationsRes
        ] = await Promise.all([
          AdminAPI.get('/admin/activities'),
          AdminAPI.get('/admin/user-logs'),
          AdminAPI.get('/admin/feedbacks'),
          AdminAPI.get('/admin/slots', { withCredentials: true }),
          AdminAPI.get('/admin/users', { withCredentials: true }),
          AdminAPI.get('/admin/reservations')
        ]);

        setReservation(activitiesRes.data);
        setUserLogs(userLogsRes.data.map(log => ({
          _id: log._id,
          action: log.action,
          createdAt: log.createdAt,
          firstname: log.userId.firstname,
          lastname: log.userId.lastname,
          userType: log.userId.userType
        })));
        setFeedbacks(feedbacksRes.data);
        setShowSlots(slotsRes.data);
        setCountUser(usersRes.data.filter(user => user.status === 'Active'));
        setCountReservation(reservationsRes.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchData();
    socket.emit('joinAdmin');

    socket.on('reservationCreated', (reservation) => {
      setReservation(prev => [reservation, ...prev]);
      setUnseenCount(prev => prev + 1);
    });

    socket.on('reservationCancelled', (reservation) => {
      setReservation(prev => [reservation, ...prev]);
      setUnseenCount(prev => prev + 1);
    });

    socket.on('reservationCancelledByUser', (activity) => {
      setReservation(prev => [activity, ...prev]);
      setUnseenCount(prev => prev + 1);
    });

    return () => {
      socket.off('reservationCreated');
      socket.off('reservationCancelled');
      socket.off('reservationCancelledByUser');
    };
  }, []);

  const combinedActivities = [...userLogs, ...reservation].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <AdminHeader />
      <div className='flex flex-col gap-y-10'>
        <div className='flex items-center justify-between px-10 mt-10'>
          <h2 className='text-xl text-color font-semibold'>System Overview</h2>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className='flex justify-between gap-5 px-20'>
          <DashboardCard icon={UsersIcon} title={'Total Users'} value={countUser.length} to={'/users-lists'} />
          <DashboardCard icon={MapPinIcon} title={'Parking Slots'} value={showSlots.length} to={'/admin-dashboard/available-slots'} />
          <DashboardCard icon={CalendarIcon} title={'Reservations'} value={countReservation.length} to={'/reservation/lists'} />
          <DashboardCard icon={ChatBubbleOvalLeftIcon} title={'Feedbacks'} value={feedbacks.length} to={'/feedbacks'} />
        </motion.div>

        <div className="flex flex-col items-center justify-center my-5 w-full px-5">
          <div className="w-full max-w-4xl">
            <h2 className="text-lg font-semibold text-color mb-3 text-center relative">Users Activities</h2>
            <div className="bg-white shadow-md rounded-xl p-4 h-96 overflow-y-auto border border-gray-200">
              {combinedActivities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">Loading activities...</p>
              ) : (
                combinedActivities.map((item, index) => {
                  const isLatest = index === 0 && unseenCount > 0 && !!item.slotCode;
                  const isReservation = !!item.slotCode;
                  return (
                    <div key={item._id || index} className="p-3 border-b border-gray-200 text-sm relative">
                      {isLatest && <span className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-2 h-2 bg-color-3 rounded-full animate-pulse"></span>}
                      <p className="font-semibold text-color flex items-center gap-1">
                        {getUserTypeIcon(isReservation ? item.reservedBy?.userType : item.userType)}
                        {isReservation ? `${item.reservedBy?.firstname} ${item.reservedBy?.lastname}` : `${item.firstname} ${item.lastname}`}
                      </p>
                      <div className="text-gray-600">
                        {isReservation ? (
                          <>
                            {item.status === 'Pending' && <>Requested a reservation for slot <span className="font-semibold">{item.slotCode}</span>. The slot status is now reserved.</>}
                            {item.status === 'Reserved' && <>Confirmed a reservation on slot <span className="font-semibold">{item.slotCode}</span>. The slot status is now occupied.</>}
                            {item.status === 'Cancelled' && <>Cancelled their reservation. The slot status is now available.</>}
                            {item.status === 'Completed' && <>Completed their reservation on slot <span className="font-semibold">{item.slotCode}</span>. The slot status is now available.</>}
                          </>
                        ) : (
                          <>
                            {item.action === 'logged in' && <>Logged in to the system.</>}
                            {item.action === 'logged out' && <>Logged out from the system.</>}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
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
  );
};

export default AdminDashboard;
