import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import toastOptions from '../../../lib/toastConfig';
import { useAdminContext } from "../../../context/adminContext";
import { useNavigate } from 'react-router-dom';
import AdminAPI from '../../../lib/inteceptors/adminInterceptor';
import Loader from '../../loaders/loader';


const AdminSignInForm = () => {

  const [ adminData, setAdminData ] = useState({
    adminusername: '',
    adminpassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Login } = useAdminContext();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setAdminData({...adminData, [name]: value});
 }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!adminData.adminusername){
      toast.error('Admin username is required.', toastOptions);
      return;
    }

    if(!adminData.adminpassword){
      toast.error('Admin password is required.', toastOptions);
      return;
    }

    try {

      setLoading(true);

      const res = await AdminAPI.post('http://localhost:4100/admin/sign-in', adminData);
      
      if(res.data.success){
        Login({ verified: true });
        Swal.fire({
          title: 'Credentials Valid',
          text: res.data.message,
          icon: 'success',
          confirmButtonColor: '#00509e',
          confirmButtonText: 'Confirm'
        }).then(() => {
          navigate('/admin-dashboard');
        });
      }

    } 
    catch (err) {

      if(err.response && err.response.data) {
              Swal.fire({
                title: 'Sign in failed',
                text: err.response.data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'Try Again'
              });
            }
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen px-5'>
        <div className='flex flex-col items-center justify-center gap-y-5 p-10 shadow-md shadow-color-2 w-full max-w-sm'>

          <h2 className='font-semibold text-color text-xl'>Admin Sign In</h2>

          <form className='w-full'>

            <div className='flex flex-col gap-y-3'>

              <input type="text"
              className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
              name='adminusername'
              value={adminData.adminusername}
              onChange={handleChange}
              placeholder='Admin Username'
              />

              <input type="password"
              className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
              name='adminpassword'
              value={adminData.adminpassword}
              onChange={handleChange}
              placeholder='Admin Password'
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

      {loading ? (
        <div>
            <Loader />
        </div>
      ) : (
        <div>

        </div>
      )}
    </>
  )
}

export default AdminSignInForm;
