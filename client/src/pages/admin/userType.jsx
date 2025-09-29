import React from 'react'
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/headers/adminHeader';

const UserType = () => {
  return (
    <>
        <AdminHeader />
        <div className='flex items-center justify-center min-h-[550px] px-5'>

          <div className='flex flex-col items-center gap-10 p-10 shadow-sm shadow-black'>

            <div className='flex flex-col items-center'>
              <h2 className='font-semibold text-lg text-color-3'>Account Type</h2>
              <p className='text-color-2 text-sm'>Select the account type for the new account</p>
            </div>

            <div className='flex gap-2'>
                <Link to={'/admin/student-registration'} className='p-4 bg-color-3 text-white text-sm w-[150px] text-center cursor-pointer hover:opacity-90'>
                  Student Account
                </Link>
                <Link to={'/registration/staff'} className='p-4 bg-color-3 text-white text-sm w-[150px] text-center cursor-pointer hover:opacity-90'>
                  Staff Account
                </Link>
            </div>

          </div>
          
        </div>
        
    </>
  )
}

export default UserType;
