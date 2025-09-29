import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { publicApi } from '../../lib/api'; 
import Loader from '../../components/loaders/loader';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setIsLoading(true)
        try{
            const res = await publicApi.post('/reset-password', {email});
            Swal.fire('Success', res.data.message, 'success');
            setEmail('');

        } catch(err){
            Swal.fire('Reset Failed', err.response?.data?.message || 'Something went wrong', 'error');
            setEmail('')
        } finally {
            setIsLoading(false)
        }
    }


  return (
   <>

    <div className='flex items-center justify-center min-h-screen px-5'>

        <div className='flex flex-col items-center justify-center gap-y-5 bg-white p-5 rounded-lg shadow-lg w-full max-w-md'>

            <div className='flex flex-col items-center gap-y-2 text-center'>
                <h2 className='text-2xl font-bold text-color'>Forgot Your Password?</h2>
                
                <p className='text-sm text-color-2 w-full max-w-xs text-center'>Enter your email address below and we'll send you instruction to reset your password.</p>
            </div>
        
            <form className='w-full'>

                <div className='flex flex-col gap-y-2'>

                    <label htmlFor="Reset-email"
                    className='text-sm font-bold text-color'>
                        Email Address:
                    </label>

                    <input type="email"
                    required
                    name='email'
                    id='Reset-email'
                    onChange={handleChange}
                    value={email}
                    placeholder='Your email address'
                    className='w-full p-2 border rounded-md outline-none focus:border-color-3 text-sm text-color-2' 
                    />
                    
                </div>

                <div className='mt-5 text-center flex flex-col gap-y-3'>

                    <button className='w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-900 hover:to-blue-500 transition duration-300 cursor-pointer text-sm'
                    onClick={handleSubmit}>
                        Send Reset Instruction
                    </button>

                    <div>
                        <Link to='/sign-in' className='text-color text-sm hover:text-color-3'>
                            Remembered Your Password?
                        </Link>
                    </div>
                    

                </div>
              
            </form>

        </div>

    </div>

    {isLoading ? <Loader text='Sending instruction on provided email...'/> : null}

   </>
  )
}

export default ForgotPassword;
