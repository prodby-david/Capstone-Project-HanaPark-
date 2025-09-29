import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/adminContext';
import { api } from '../../lib/api'




const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { Logout } = useAdminContext();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false); 
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
          title: 'Logged out!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirm',
          }).then(async () => {
            await api.post('/admin/logout', {});
            Logout();
            navigate('/admin/passcode');
          });
        }
      });
  };


  return (
    <>
      <nav className='flex items-center justify-between px-10 py-3 bg-color text-white'>
        <Link to={'/admin-dashboard'} className='text-xl font-bold'>
          HanaPark Admin
        </Link>

        <div className='flex gap-x-5 text-sm items-center'>
          <Link
            to={'/admin/student-registration'}
            className='hover:text-color-3 font-semibold'
          >
            Create User
          </Link>

          <Link
            to={'/admin/slots'}
            className='hover:text-color-3 font-semibold'
          >
            Create Slots
          </Link>

          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='hover:text-color-3 font-semibold cursor-pointer'
            >
              Settings
            </button>

            {isOpen && (
              <div className='absolute top-5 -right-8 mt-2 w-40 bg-white text-color-2 text-center shadow-md z-50'>
                <button
                  onClick={handleLogout}
                  className='block w-full px-4 py-2 hover:bg-gray-100 text-center cursor-pointer'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminHeader;
