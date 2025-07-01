import React from 'react'
import { useAuth } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import UserHeader from '../../components/headers/userHeader';
import UserFooter from '../../components/footers/userFooter';




const Dashboard = () => {

const { auth } = useAuth(); 

  return (

    <>
      <UserHeader />

      <div className='flex flex-col items-center justify-center mt-15 lg:mt-20'>
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
        className='flex flex-col lg:flex-row gap-4 items-center justify-center px-5 mt-10'>

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

            <Link to={'/user/reservation-form'} 
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
              View History
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

        <UserFooter />
      </div>

      
      
    </>
    
      
    
  )
}

export default Dashboard;
