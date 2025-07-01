import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeftStartOnRectangleIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'




const UserHeader = () => {

const { logout } = useAuth(); 
const navigate = useNavigate();

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
            }).then(() => {
                logout();
                navigate('/');
            });
        }
    });
}



  return (
    <>

    <div className='flex justify-between items-center py-4 px-6 bg-white shadow-md'>

        <div className='flex items-center gap-x-px text-color'>
            <h2 className='font-bold text-sm md:text-md'>
                HanaPark
            </h2>
        </div>
        

        <div className='flex items-center gap-x-5 font-semibold text-color-3 text-sm lg:text-lg'>

            <div className='flex items-center cursor-pointer hover:text-color-3 transition duration-300 ease-in-out group'>
                <Cog8ToothIcon className="w-5 h-5 text-color-3 group-hover:text-color cursor-pointer"/>
                <Link to={'/settings'} 
                    className='hover:text-color text-sm md:text-md'
                    >
                        Settings
                </Link>

            </div>
            

            <div className='flex items-center cursor-pointer hover:text-color-3 transition duration-300 ease-in-out group'>

                <ArrowLeftStartOnRectangleIcon 
                className="w-5 h-5 text-color-3 group-hover:text-color cursor-pointer" 
                />

                <button 
                onClick={handleLogout} 
                className='cursor-pointer hover:text-color text-sm md:text-md'
                >
                    Logout
                </button>

            </div>

            

        </div>
        
    </div>

    </>
  )
}

export default UserHeader;
