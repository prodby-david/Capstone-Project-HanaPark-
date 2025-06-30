import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { useAuth } from '../../context/authContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'


 
const SignIn = () => {

  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });

const { setAuth } = useAuth();
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);

 const togglePassword = () => {
  setShowPassword(prev => !prev);
 }

 const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
 }

 const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      if(!userData.username){
          toast.error('Username should not be empty.', toastOptions);
          return;
      }

      if(!userData.password){
        toast.error('Password should not be empty.', toastOptions);
        return;
      }

      const res = await axios.post('http://localhost:4100/sign-in', userData, { withCredentials: true });

      setAuth({ user: res.data.user });

      if(res.data.success){
        Swal.fire({
          title: 'Sign in successful',
          text: 'Press Confirm to continue.',
          icon: 'success',
          confirmButtonColor: '#00509e',
          confirmButtonText: 'Confirm'
        }).then(() => {
          navigate('/dashboard')
        });

      setUserData({
        username: '',
        password: ''
      });

      }
    }catch(err){

      if(err.response && err.response.data) {
        Swal.fire({
          title: 'Sign in failed',
          text: err.response.data.message || 'An error occurred',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    }

}


  return (
    <>

    <div className='flex items-center justify-center min-h-screen px-5'>

      <div className='flex flex-col items-center justify-center gap-y-5 bg-white p-5 rounded-lg shadow-lg w-full max-w-md'>

        <div className='text-center'>
          <h2 className='text-[26px] font-bold text-color'>HanaPark</h2>
          <p className='text-color-2 text-sm'>Parking System</p>
        </div>

        <form className='flex flex-col gap-y-3 w-full'>

          <input type="text"
          required
          name='username'
          id='Username'
          onChange={handleChange}
          value={userData.username}
          className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2'
          placeholder='Username'/>  
          
          <div className='relative'>
            <input type={showPassword ? 'text' : 'password'}
            required
            name='password'
            id='Password'
            onChange={handleChange}
            value={userData.password}
            className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
            placeholder='Password' 
            />

            { showPassword ? (
              <EyeIcon 
              className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer' 
              onClick={togglePassword} 
              fontSize={'12px'}/>
            ) : (
              <EyeSlashIcon 
              className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer'
              onClick={togglePassword}
              fontSize={'12px'} /> 
            )
          }

          </div>
          

          <div className='w-full'>

            <button className='w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-300 cursor-pointer text-sm' onClick={handleSubmit}>
              Sign In
            </button>

          </div>

        </form>

        <Link to='/reset-password' className='text-sm text-color'>
          Forgot Password?
        </Link>

      </div>

    </div>
    </>
  )
}

export default SignIn;
