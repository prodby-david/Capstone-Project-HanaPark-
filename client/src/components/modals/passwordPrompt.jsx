import React, { useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/adminContext';



const PasswordPrompt = () => {

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { verifyPasscode } = useAdminContext();


    const handleSubmit = async (e) => {

      e.preventDefault();

      if (!password) {
      toast.error('Password should not be empty.', toastOptions);
      return;
    }


      try{

          const res = await axios.post('http://localhost:4100/admin/passcode-verification', { password });

          if(res.data.success){
            Swal.fire({
              title: 'Password Confirmed.',
              text: res.data.message,
              icon: 'success',
              confirmButtonColor: '#00509e',
              confirmButtonText: 'Confirm'
              }).then((result) => {
                if(result.isConfirmed){
                  verifyPasscode();
                  navigate('/admin/sign-in');
                }
              });
          }
      }
      catch(err){
           Swal.fire({
              title: 'Validation failed',
              text: err.response?.data?.message,
              icon: 'error',
              confirmButtonColor: '#00509e',
              confirmButtonText: 'OK'
          });
      }

    }


  return (
      <>
        <div className='flex items-center justify-center min-h-screen px-5'>

          <div className='flex flex-col items-center justify-center gap-y-3 w-full max-w-sm shadow-md shadow-color-2 p-10'>

            <h2 className='text-lg text-color font-semibold'>Admin Access</h2>

            <form className='w-full'>

              <div className='flex flex-col gap-y-3'>

                <input type="password"
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Passcode"
                className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
                />

                <button 
                type='submit'
                onClick={handleSubmit}
                className='w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-900 hover:to-blue-500 transition duration-300 cursor-pointer text-sm'>
                  Submit
                </button>

              </div>
              
            </form>

          </div>
          
        </div>
      </>
    )
}

export default PasswordPrompt;
