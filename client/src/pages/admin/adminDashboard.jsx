import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container } from '../../lib/motionConfigs';
import AdminHeader from '../../components/headers/adminHeader';
import DashboardCard from '../../components/cards/dashboardCards';
import { UsersIcon, MapPinIcon, CalendarIcon, WalletIcon } from '@heroicons/react/24/solid'
import { api } from '../../lib/api';


const AdminDashboard = () => {

  const [showSlots, setShowSlots] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = localStorage.getItem('passcode_verified');
    if (!verified) {
      navigate('/admin/passcode'); 
    }
  }, [navigate]);

   useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get('http://localhost:4100/admin/slots', {withCredentials: true});
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
        const res = await api.get('http://localhost:4100/admin/users', {withCredentials: true});
        setCountUser(res.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };

    countUsers();
  }, []);

  return (
    <>
        <AdminHeader />

        <div className='flex flex-col gap-y-10'>

            <div className='flex items-center justify-between px-10 mt-10'>
                <h2 className='text-xl text-color font-semibold'>System Overview</h2>
                <h2>Filters</h2>
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
                value={0}
                to={'/admin-dashboard/reservations'} 
                />

                <DashboardCard 
                icon={WalletIcon}
                title={'Revenue'}
                value={'₱ 0'}
                to={'/admin-dashboard/parking-revenue'} 
                />
                   
            </motion.div>
        </div>
    </>
  )
}

export default AdminDashboard;
