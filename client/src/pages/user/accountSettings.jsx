import React, { useState, useEffect, useRef } from 'react';
import UserHeader from '../../components/headers/userHeader';
import { UserIcon, KeyIcon, IdentificationIcon, EyeIcon, EyeSlashIcon, PencilIcon } from '@heroicons/react/24/outline';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import SaveChanges from '../../components/buttons/savechanges';
import Loader from '../../components/loaders/loader';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import brandsByType from '../../../utils/brandsByType';

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
  });
  const [password, setPassword] = useState({
    currentpassword: '',
    newpassword: '',
    confirmnewpassword: ''
  });
  const [vehicleInformation, setVehicleInformation] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleNewPassword = () => setShowNewPassword(prev => !prev);

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
    };
    getUserInfo();
  }, [activeSection]);

  useEffect(() => {
    const getUserVehicleInfo = async () => {
      if (activeSection === 'vehicle') {
        setLoading(true);
        try {
          const res = await UserAPI.get('/user/vehicle-type');
          setVehicleInformation(res.data.vehicle);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };
    getUserVehicleInfo();
  }, [activeSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInformation(prev => ({ ...prev, [name]: value }));
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
    setLoading(true);
    try {
      const res = await UserAPI.put('/update-email', { email: userInfo.email });
      if (res.data.success) {
        Swal.fire({
          title: 'Email updated successfully.',
          text: res.data.message,
          showConfirmButton: true,
          icon: 'success',
          confirmButtonText: 'Back to dashboard'
        }).then((result) => {
          if (result.isConfirmed) navigate('/dashboard');
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Email update error',
        text: err.response?.data?.message || "Something went wrong",
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'Try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password.currentpassword || !password.newpassword || !password.confirmnewpassword) {
      toast.error("Field must not be empty.", toastOptions);
      return;
    }
    if (password.newpassword !== password.confirmnewpassword) {
      toast.error("New password and confirm new password doesn't match", toastOptions);
      return;
    }
    try {
      const res = await UserAPI.put('/change-password', {
        currentpassword: password.currentpassword,
        newpassword: password.newpassword
      });
      if (res.data.success) {
        Swal.fire({
          title: 'Change password success.',
          text: res.data.message,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Back to dashboard'
        }).then((result) => {
          if (result.isConfirmed) navigate('/dashboard');
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Change Password failed',
        text: err.response?.data?.message || "Something went wrong",
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'Try again'
      });
    }
  };

  return (
    <>
      <UserHeader />

      <div className="flex items-center justify-center px-5">
        <div className="flex flex-col md:flex-row justify-around p-5 gap-5 w-full bg-white max-w-3xl shadow-xs shadow-black rounded-md min-h-[550px] my-5">

          {/* Sidebar for desktop */}
          <div className="hidden md:flex flex-col gap-y-5 sticky top-20 self-start w-[220px]">
            <h2 className="text-lg font-semibold text-color">Settings</h2>
            <div className="flex flex-col gap-2 items-start">
              <button
                onClick={() => setActiveSection("profile")}
                className={`flex items-center w-full px-3 py-2 rounded-md cursor-pointer ${activeSection === "profile" ? "bg-blue-200" : "hover:bg-gray-100"}`}
              >
                <UserIcon className="w-5 h-5 mr-2 text-color" />
                <span className="text-sm font-semibold">Profile Information</span>
              </button>
              <button
                onClick={() => setActiveSection("password")}
                className={`flex items-center w-full px-3 py-2 rounded-md cursor-pointer ${activeSection === "password" ? "bg-blue-200" : "hover:bg-gray-100"}`}
              >
                <KeyIcon className="w-5 h-5 mr-2 text-color" />
                <span className="text-sm font-semibold">Change Password</span>
              </button>
              <button
                onClick={() => setActiveSection("vehicle")}
                className={`flex items-center w-full px-3 py-2 rounded-md cursor-pointer ${activeSection === "vehicle" ? "bg-blue-200" : "hover:bg-gray-100"}`}
              >
                <IdentificationIcon className="w-5 h-5 mr-2 text-color" />
                <span className="text-sm font-semibold">Vehicle Information</span>
              </button>
            </div>
          </div>

         
          {/* Divider desktop */}
          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Account Settings Content */}
          <div className="w-full">
            <h2 className="text-lg font-semibold text-color mb-5 text-center">
              Account Settings
            </h2>

             {/* Tabs for mobile */}
          <div className="flex md:hidden justify-around mb-5 gap-2">
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeSection === "profile" ? "bg-blue-200" : "bg-gray-100"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveSection("password")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeSection === "password" ? "bg-blue-200" : "bg-gray-100"}`}
            >
              Password
            </button>
            <button
              onClick={() => setActiveSection("vehicle")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeSection === "vehicle" ? "bg-blue-200" : "bg-gray-100"}`}
            >
              Vehicle
            </button>
          </div>


            {activeSection === 'profile' && (
              <div>
                <h2 className="font-semibold text-md text-color-3">Profile Information</h2>
                <div className="w-full h-px bg-color-3"></div>
                <form className="h-[350px] overflow-y-auto">
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Last Name</label>
                    <input type="text" className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" value={userInfo.lastname} readOnly />
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">First Name</label>
                    <input type="text" className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" value={userInfo.firstname} readOnly />
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Middle Name</label>
                    <input type="text" className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" value={userInfo.middlename} readOnly />
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Student ID</label>
                    <input type="number" className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" value={userInfo.studentId} readOnly />
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Email</label>
                    <div className="flex items-center gap-x-2 relative">
                      <input ref={inputRef} type="email" name="email" className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" onChange={handleChange} readOnly={!isEditable} value={userInfo.email} />
                      <button type="button" onClick={handleEditClick}>
                        <PencilIcon className="w-4 h-4 cursor-pointer hover:text-color-3 bottom-2 absolute right-2" title="Edit Email" />
                      </button>
                    </div>
                  </div>
                </form>
                <button className="w-full bg-color-3 mt-5 p-2 text-white rounded-sm text-sm cursor-pointer hover:opacity-90" onClick={handleChangeEmail}>
                  Save changes
                </button>
              </div>
            )}

            {activeSection === 'password' && (
              <div>
                <h2 className="font-semibold text-md text-color-3">Change Password</h2>
                <div className="w-full h-px bg-color-3"></div>
                <form className="mt-5" onSubmit={handleChangePassword}>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="currentpassword" value={password.currentpassword} onChange={handlePasswordChange} className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" />
                      {showPassword ? (
                        <EyeIcon className="absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer" onClick={togglePassword} />
                      ) : (
                        <EyeSlashIcon className="absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer" onClick={togglePassword} />
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} name="newpassword" value={password.newpassword} onChange={handlePasswordChange} className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" />
                      {showNewPassword ? (
                        <EyeIcon className="absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer" onClick={toggleNewPassword} />
                      ) : (
                        <EyeSlashIcon className="absolute right-3 top-2 w-5 h-5 text-color-2 cursor-pointer" onClick={toggleNewPassword} />
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Confirm New Password</label>
                    <input type="password" name="confirmnewpassword" value={password.confirmnewpassword} onChange={handlePasswordChange} className="outline-0 border-b focus:border-color-3 p-2 text-sm text-color-2 w-full" />
                  </div>
                  <SaveChanges />
                </form>
              </div>
            )}

              {activeSection === 'vehicle' && (
              <div>
                <h2 className="font-semibold text-md text-color-3">Vehicle Information</h2>
                <div className="w-full h-px bg-color-3"></div>
                <form className="h-[350px] overflow-y-auto">

                  {/* Vehicle Type Dropdown */}
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                      value={vehicleInformation.vehicleType || ""}
                      onChange={handleVehicleChange}
                    >
                      <option value="">Select Vehicle Type</option>
                      {Object.keys(brandsByType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Dropdown */}
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Brand</label>
                    <select
                      name="brand"
                      className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                      value={vehicleInformation.brand || ""}
                      onChange={handleVehicleChange}
                      disabled={!vehicleInformation.vehicleType}
                    >
                      <option value="">
                        {vehicleInformation.vehicleType
                          ? "Select Brand"
                          : "Select vehicle type first"}
                      </option>
                      {(brandsByType[vehicleInformation.vehicleType] || []).map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Year Model</label>
                    <input
                      type="number"
                      name="model"
                      className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                      value={vehicleInformation.model || ""}
                      onChange={handleVehicleChange}
                      placeholder="e.g. 2024, 2025, etc."
                    />
                  </div>

                  {/* Plate Number */}
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Plate Number</label>
                    <input
                      type="text"
                      name="plateNumber"
                      className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                      value={vehicleInformation.plateNumber || ""}
                      onChange={handleVehicleChange}
                      placeholder="e.g. 123ABC or 1234-00000012345"
                    />
                  </div>

                  {/* Color */}
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

                  {/* Transmission Dropdown */}
                  <div className="mt-3">
                    <label className="font-semibold text-color-3">Transmission (Optional)</label>
                    <select
                      name="transmission"
                      className="outline-0 border-b p-2 text-sm text-color-2 w-full"
                      value={vehicleInformation.transmission || ""}
                      onChange={handleVehicleChange}
                    >
                      <option value="">Select Transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </form>
                <SaveChanges onClick={handleSaveVehicle} />
              </div>
            )}


          </div>
        </div>
      </div>

      {loading && <Loader text="Loading information..." />}
    </>
  );
};

export default AccountSettings;
