import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Swal from 'sweetalert2';
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api';


const UserHeader = () => {

const { logout, auth } = useAuth(); 
const userId = auth.user?._id;


const [isOpen, setIsOpen] = useState(false);

const toggleMenu = () => setIsOpen(!isOpen);

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
            }).then(async() => {
                await api.post('http://localhost:4100/logout', {});
                logout();
            });
        }
    });
}



  return (
    <>

    <div className='flex justify-between items-center py-4 px-6 bg-white shadow-md'>

        <div className='flex items-center gap-x-px text-color'>
            <Link  to={'/dashboard'} className='font-bold text-sm md:text-md'>HanaPark</Link>
        </div>

        <Bars3Icon 
            onClick={toggleMenu}
            className="w-6 h-6 text-color-3 cursor-pointer md:hidden"
        />

        <div className={`flex-col md:flex md:flex-row md:items-center md:gap-x-5 ${isOpen ? 'flex' : 'hidden'} absolute top-14 left-0 w-full bg-white shadow-md md:static md:w-auto md:shadow-none transition ease-in-out`}>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center absolute top-1 left-0 w-full bg-white shadow-md md:hidden text-color-3 "
            >

            <button
                onClick={() => {
                  toggleMenu()
                  handleLogout()
                }}
                className="p-5 flex items-center gap-2 cursor-pointer hover:text-color"
            >

            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Logout
            </button>

            </motion.div>
          )}
        </AnimatePresence>

        <div className='hidden md:flex items-center gap-x-2'>

            <div className='flex items-center gap-x-1 group'>
                    <Link to={'/notifications'} 
                        className='hover:text-color text-sm md:text-md text-color-3'
                    >
                        <BellIcon
                        title="Notifications"
                        className="w-5 h-5 text-color-3 group-hover:text-color cursor-pointer"/>
                    </Link>
            </div>
        
            <div className='flex items-center gap-x-1'>

                <button 
                onClick={handleLogout} 
                className='cursor-pointer hover:text-color text-sm md:text-md text-color-3'
                >
                    <ArrowLeftStartOnRectangleIcon
                    title='Logout' 
                    className="w-5 h-5 text-color-3 hover:text-color cursor-pointer" 
                    />
                </button>

            </div>
            
        </div> 

        </div>
        
    </div>

    </>
  )
}

export default UserHeader;
