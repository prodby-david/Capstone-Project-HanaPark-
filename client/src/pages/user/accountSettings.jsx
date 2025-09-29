import React, { useState, useEffect, useRef } from 'react'
import UserHeader from '../../components/headers/userHeader';
import { UserIcon, KeyIcon, IdentificationIcon,EyeIcon, EyeSlashIcon, PencilIcon } from '@heroicons/react/24/outline';
import  UserAPI from '../../lib/inteceptors/userInterceptor'
import SaveChanges from '../../components/buttons/savechanges';
import Loader from '../../components/loaders/loader';
import {toast} from 'react-toastify'
import toastOptions from '../../lib/toastConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const AccountSettings = () => {


  const [activeSection, setActiveSection] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    lastname: "",
    firstname: "",
    middlename: "",
    yearLevel: "",
    course: "",
    studentId: "",
    email: ""
  })
  const [password, setPassword] = useState({
    currentpassword: '',
    newpassword: '',
    confirmnewpassword: ''
  })
  const [vehicleInformation, setVehicleInformation] = useState({
    
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [ showNewPassword, setShowNewPassword] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isVehicleEditable, setIsVehicleEditable] = useState(false);
  const inputRef = useRef(null);

  
  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputRef.current.focus(); 
    }, 0);
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  }

  const toggleNewPassword = () => {
    setShowNewPassword(prev => !prev);
  }

  useEffect(() => {
    const getUserInfo = async () => {
       if (activeSection === "profile") {
      setLoading(true);
      try {
        const res = await UserAPI.get('/profile');
        setUserInfo(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    }
    getUserInfo();
  }, [activeSection]);

  useEffect(() => {
    const getUserVehicleInfo = async () => {
      
      if(activeSection === 'vehicle'){
        setLoading(true);

        try {
          const res = await UserAPI.get('/user/vehicle-type')
          setVehicleInformation(res.data.vehicle);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
      }
    }
    getUserVehicleInfo();
  }, [activeSection])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({...prev, [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInformation((prev) => ({ ...prev, [name]: value }));
  };

    const handleSaveVehicle = async () => {
      try {
        const res = await UserAPI.put('/vehicle-information', vehicleInformation);

        if (res.data.success) {
          Swal.fire({
            title: "Vehicle Updated",
            text: res.data.message,
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Update Failed",
          text: err.response?.data?.message || "Something went wrong",
          icon: "error",
          confirmButtonText: "Try again",
        });
      }
  };

  const handleChangeEmail = async (e) => {
      e.preventDefault();

      setLoading(true)

      try {
        const res = await UserAPI.put('/update-email', {email: userInfo.email})

        if(res.data.success){
          Swal.fire({
            title: 'Email updated successfully.',
            text: res.data.message,
            showConfirmButton: true,
            icon: 'success',
            confirmButtonText: 'Back to dashboard'
          }).then((result) => {
            if(result.isConfirmed){
              navigate('/dashboard')
            }
          })
        }
      } catch (err) {
        Swal.fire({
            title: 'Email update error',
            text: err.response.data.message,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Try again'
          })
      } finally {
        setLoading(false)
      }
  }


  const handleChangePassword = async (e) => {

    e.preventDefault();

    if(password.newpassword !== password.confirmnewpassword){
      toast.error("New password and confirm new password doesn't match", toastOptions);
      return;
    }

    try {
      const res = await UserAPI.put('/change-password', {
        currentpassword:password.currentpassword,
        newpassword: password.newpassword
      }
    );

      if(res.data.success){
        Swal.fire({
          title: 'Change password success.',
          text: res.data.message,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Back to dashboard'
        }).then((result) => {
          if(result.isConfirmed){
            navigate('/dashboard')
          }
        })
      }
    } catch (err) {
      Swal.fire({
          title: 'Change Password failed',
          text: err.response.data.message,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Try again'
        })
    }

  }


  return (
    <>
      <UserHeader />

      <div className='flex items-center justify-center px-5 mt-5'>
        <div className='flex justify-around p-5 gap-x-10 w-full bg-white max-w-4xl shadow-xs shadow-black'>
          
          {/*--------------- Setting Sidebar --------------- */}
          <div className='hidden md:flex flex-col gap-y-5 sticky top-20 self-start'>

            <h2 className='text-lg font-semibold text-color'>Settings</h2>

            <div className='flex flex-col gap-2 items-center'>
              
                <button 
                onClick={() => setActiveSection("profile")}
                className={`flex items-center pl-3 w-[220px] cursor-pointer ${activeSection === "profile" ? "bg-blue-200" : ""}`}
              >
                <UserIcon className='w-5 h-5 text-color'/>
                <p className='text-sm text-color p-2 font-semibold'>Profile Information</p>
              </button>

              <button 
                onClick={() => setActiveSection("password")}
                className={`flex items-center pl-3 w-[220px] cursor-pointer ${activeSection === "password" ? "bg-blue-200" : ""}`}
              >
                <KeyIcon className='w-5 h-5 text-color'/>
                <p className='text-sm text-color p-2 font-semibold'>Change Password</p>
              </button>

              <button 
                onClick={() => setActiveSection("vehicle")}
                className={`flex items-center pl-3 w-[220px] cursor-pointer ${activeSection === "vehicle" ? "bg-blue-200" : ""}`}
              >
                <IdentificationIcon className='w-5 h-5 text-color'/>
                <p className='text-sm text-color p-2 font-semibold'>Vehicle Information</p>
              </button>

            </div>
            
          </div>
          

          {/* --------------- Vertical Divider --------------- */}
          <div className='w-px bg-gray-300 hidden md:block'></div>

          {/* --------------- Account Settings --------------- */}
          <div className='w-full max-w-md h-[500px]'>
            <h2 className='text-lg font-semibold text-color mb-5 text-center'>
              Account Settings
            </h2>

            {/* --------------- Form --------------- */}
            {activeSection === 'profile' && (
            <div>
              <div>
                <h2 className='font-semibold text-md text-color-3'>
                  Profile Information
                </h2>
                <div className='w-full h-px bg-color-3'></div>
              </div>

              <form className='h-[350px] overflow-y-auto'>

              <div className='mt-3 '>
                <label className='font-semibold text-color-3'>Last Name</label>
                <input
                  type="text"
                  className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                  onChange={handleChange}
                  readOnly
                  value={userInfo.lastname}
                />
              </div>

              <div className='mt-3'>
                <label className='font-semibold text-color-3'>First Name</label>
                <input
                  type="text"
                  className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                  onChange={handleChange}
                  readOnly
                  value={userInfo.firstname}
                />
              </div>

              <div className='mt-3'>
                <label className='font-semibold text-color-3'>Middle Name</label>
                <input
                  type="text"
                  className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                  onChange={handleChange}
                  readOnly
                  value={userInfo.middlename}
                />
              </div>

              <div className='mt-3'>
                <label className='font-semibold text-color-3'>Student ID</label>
                <input
                  type="number"
                  className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                  readOnly
                  onChange={handleChange}
                  value={userInfo.studentId}
                />
              </div>

              <div className='mt-3'>
                <label className='font-semibold text-color-3'>Email</label>
                <div className='flex items-center gap-x-2 relative'>
                  <input
                  ref={inputRef}
                  type="email"
                  name='email'
                  className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                  onChange={handleChange}
                  readOnly={!isEditable}
                  value={userInfo.email}
                  />
                  <button type='button' onClick={handleEditClick}>
                    <PencilIcon className='w-4 h-4 cursor-pointer hover:text-color-3 bottom-2 absolute right-2' title='Edit Email' />
                  </button>
                </div>
                
              </div>
          
            </form>

              <button className='w-full bg-color-3 mt-5 p-2 text-white rounded-sm text-sm cursor-pointer hover:opacity-90' onClick={handleChangeEmail}>
                Save changes
              </button>
            </div>
          )}

            {activeSection === 'password' && (
              <div>

                <div>
                  <h2 className='font-semibold text-md text-color-3'>
                    Change Password
                  </h2>
                  <div className='w-full h-px bg-color-3'></div>
                </div>

                <form className='mt-5' onSubmit={handleChangePassword}>
                    <div className='mt-3'>
                      <label htmlFor="CurrentPassword" className='font-semibold text-color-3'>
                        Current Password
                      </label>
                      <div className='relative'>
                        <input
                        type={showPassword ? 'text' : 'password'}
                        id='CurrentPassword'
                        name='currentpassword'
                        value={password.currentpassword}
                        onChange={handlePasswordChange}
                        className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                        />
                        {showPassword ? (
                          <EyeIcon 
                          className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer' 
                          onClick={togglePassword} 
                          fontSize={'12px'}/>
                        ) : (
                          <EyeSlashIcon 
                          className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer'
                          onClick={togglePassword}
                          fontSize={'12px'} /> 
                        )}
                      </div>
                      
                    </div>

                    <div className='mt-3'>
                      <label htmlFor="NewPassword" className='font-semibold text-color-3'>
                        New Password
                      </label>
                      <div className='relative'>
                        <input
                        type={showNewPassword ? 'text' : 'password'}
                        id='NewPassword'
                        name='newpassword'
                        value={password.newpassword}
                        onChange={handlePasswordChange}
                        className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                        />
                        {showNewPassword ? (
                          <EyeIcon 
                          className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer' 
                          onClick={toggleNewPassword} 
                          fontSize={'12px'}/>
                        ) : (
                          <EyeSlashIcon 
                          className='absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer'
                          onClick={toggleNewPassword}
                          fontSize={'12px'} /> 
                        )}
                      </div>
                      
                    </div>

                    <div className='mt-3'>
                      <label htmlFor="ConfirmNewPassword" className='font-semibold text-color-3'>
                        Confirm New Password
                      </label>
                        <input
                        type='password'
                        id='ConfirmNewPassword'
                        name='confirmnewpassword'
                        value={password.confirmnewpassword}
                        onChange={handlePasswordChange}
                        className='outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full'
                        />
                    </div>

                    <SaveChanges />
                </form>
                
              </div>
            )}

            {activeSection === 'vehicle' && (
              <div>
                <h2 className='font-semibold text-md text-color-3'>
                  Vehicle Information
                </h2>
                <div className='w-full h-px bg-color-3'></div>

                 <form className="h-[350px] overflow-y-auto">
                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Vehicle Type</label>
                      <input
                        type="text"
                        name="vehicleType"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.vehicleType || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.brand || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Model</label>
                      <input
                        type="text"
                        name="model"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.model || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Plate Number</label>
                      <input
                        type="text"
                        name="plateNumber"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.plateNumber || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Color</label>
                      <input
                        type="text"
                        name="color"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.color || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                    <div className="mt-3">
                      <label className="font-semibold text-color-3">Transmission</label>
                      <input
                        type="text"
                        name="transmission"
                        className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation.transmission || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>

                  </form>
                  
                  <SaveChanges onClick={handleSaveVehicle}/>
              </div>
            )}

          </div>
        </div>
      </div>

      {loading ? <Loader text='Loading information...' /> : null}
    </>
  )
}

export default AccountSettings;
