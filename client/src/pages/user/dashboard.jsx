import React, { useEffect } from 'react'
import { useAuth } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import UserHeader from '../../components/headers/userHeader';
import UserFooter from '../../components/footers/userFooter';
import { socket } from '../../lib/socket';
import Swal from 'sweetalert2';
import FeedbackWidget from '../../components/widget/feedback';



const Dashboard = () => {

const { auth } = useAuth(); 
const navigate = useNavigate();

useEffect(() => {
  socket.on('slotCreated', (newSlot) => {
    if (newSlot.slotUser !== 'Visitor') {
          Swal.fire({
            title: 'New Slot Available!',
            text: `A new ${newSlot.slotUser} slot (${newSlot.slotNumber}) has been added.`,
            icon: 'info',
            confirmButtonColor: '#00509e'
          }).then((result) => {
            if(result.isConfirmed){
              navigate('/spots');
            }
          });
        }
    })  
  }, []);

  return (

    <>
    <div className='min-h-screen flex flex-col justify-between'>

    <UserHeader />
      <div className='flex flex-col items-center justify-center mt-10 md:mt-5'>
        <h2 className='text-[26px] lg:text-[32px] font-semibold text-color'>
          Hello, {auth.user.firstname}!
        </h2>
        <p className='text-sm text-color-2 mt-3 max-w-3xl text-center px-5'>Your parking experience just got easier. Reserve a spot, View your recent activities, and manage your account.</p>
      </div>

      <div>

        <motion.div 
        variants={container}
        initial='hidden'
        animate='show'
        className='flex flex-col lg:flex-row gap-4 items-center justify-center px-5 mt-5'>

          <motion.div 
          className='flex flex-col items-center justify-center gap-y-5 py-10 bg-white shadow-md rounded-lg text-center w-full max-w-sm'
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3}}
          >

            <MapPinIcon className="w-10 h-10 text-color-3 group-hover:text-color" />

            <div className='flex flex-col gap-y-2 '>
              <h2 className='text-xl font-semibold text-color'>Reserve a Spot</h2>
              <p className='text-sm text-color-2 '>Find and reserve a parking slot.</p>
            </div>

            <Link to={'/spots'} 
            className='p-4 bg-color-3 text-white rounded-md text-sm cursor-pointer transition ease-in-out hover:scale-105 duration-300'
            >
              Secure a Spot
            </Link>

          </motion.div>

          <motion.div 
          className='flex flex-col items-center justify-center gap-y-5 p-4 bg-white shadow-md rounded-lg text-center w-full max-w-sm py-10'
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3}}
          >

            <ClockIcon className="w-10 h-10 text-color-3 group-hover:text-color " />

            <div className='flex flex-col gap-y-2'>
              <h2 className='text-xl font-semibold text-color'>Recent Activities</h2>
              <p className='text-sm text-color-2'>Check your recent parking history.</p>
            </div>

            <Link to={'/recents'} 
            className='p-4 bg-color-3 text-white rounded-md text-sm cursor-pointer transition ease-in-out hover:scale-105 duration-300'
            >
              View Activities
            </Link>

          </motion.div>
          
          <motion.div 
          className='flex flex-col items-center justify-center gap-y-5 p-4 bg-white shadow-md rounded-lg text-center w-full max-w-sm py-10'
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3}}
          >

            <UserCircleIcon className="w-10 h-10 text-color-3 group-hover:text-color" />

            <div className='flex flex-col gap-y-2'>
              <h2 className='text-xl font-semibold text-color'>Account Settings</h2>
              <p className='text-sm text-color-2'>Update your profile, password, and more.</p>
            </div>

            <Link to={'/account-settings'} 
            className='p-4 bg-color-3 text-white rounded-md text-sm cursor-pointer transition ease-in-out hover:scale-105 duration-300'
            >
              Go to Settings
            </Link>

          </motion.div>

        </motion.div>

    
      </div>

          <UserFooter />

      <FeedbackWidget />

      </div>

    </>
 
  )
}

export default Dashboard;
