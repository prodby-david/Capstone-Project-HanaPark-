import React from 'react'
import { Link } from 'react-router-dom';

const SignIn = () => {
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
          className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2'
          placeholder='Username'/>  

          <input type="password"
          required
          name='password'
          id='Password'
          className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2'
          placeholder='Password' />

          <div className='w-full'>

            <button className='w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-300 cursor-pointer text-sm'>
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
