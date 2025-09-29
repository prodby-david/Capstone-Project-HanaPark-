import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container } from '../../lib/motionConfigs';
import AdminHeader from '../../components/headers/adminHeader';
import DashboardCard from '../../components/cards/dashboardCards';
import { UsersIcon, MapPinIcon, CalendarIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid'
import AdminAPI from '../../lib/inteceptors/adminInterceptor'


const AdminDashboard = () => {

  const [showSlots, setShowSlots] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [countReservation, setCountReservation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = sessionStorage.getItem('passcode_verified');
    if (!verified) {
      navigate('/admin/passcode'); 
    }
  }, [navigate]);

   useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await AdminAPI.get('http://localhost:4100/admin/slots', {withCredentials: true});
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
        const res = await AdminAPI.get('http://localhost:4100/admin/users', {withCredentials: true});
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

        </div>
    </>
  )
}

export default AdminDashboard;
