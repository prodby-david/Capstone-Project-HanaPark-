import React, { useState, useEffect, useRef } from 'react';
import UserHeader from '../../components/headers/userHeader';
import { UserIcon, KeyIcon, IdentificationIcon, EyeIcon, EyeSlashIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { useNavigate } from 'react-router-dom';
import brandsByType from '../../../utils/brandsByType';
import Loader from '../../components/loaders/loader';
import CustomPopup from '../../components/popups/popup';
import UserViolations from './violations';

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
  const [vehicleInformation, setVehicleInformation] = useState({
    vehicleType: '',
    brand: '',
    model: '',
    plateNumber: '',
    transmission: '',
    color: ''
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const [popup, setPopup] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const showPopup = (type, title, message, onConfirm = null) => {
    setPopup({ show: true, type, title, message, onConfirm });
  };

  const closePopup = () => setPopup(prev => ({ ...prev, show: false }));

  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleNewPassword = () => setShowNewPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

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

  const motorcycleRegex = /^[A-Z0-9]{6}$/i;    
  const fourWheelRegex = /^[A-Z]{3}[0-9]{4}$/i;  


  if(!vehicleInformation.plateNumber) {
    showPopup("error", "Plate Number Required", "Please enter your vehicle's plate number.");
    return;
  }


  if (vehicleInformation.mvFile && mvFileRegex.test(vehicleInformation.mvFile)) {
    console.log("MV File valid — skipping plate validation.");
  } else {

    if (
      vehicleInformation.vehicleType === "2-Wheels (399cc below)" ||
      vehicleInformation.vehicleType === "2-Wheels (400cc up)"
    ) {
      if (!motorcycleRegex.test(vehicleInformation.plateNumber)) {
        showPopup(
          "error",
          "Invalid Plate Number",
          "For 2-wheels, the plate number must be 6 alphanumeric characters (e.g. AB12CD or 123ABC)."
        );
        return;
      }
    }

    if (vehicleInformation.vehicleType === "4-Wheels") {
      if (!fourWheelRegex.test(vehicleInformation.plateNumber)) {
        showPopup(
          "error",
          "Invalid Plate Number",
          "For 4-wheels, the plate number must follow the format ABC1234 (3 letters followed by 4 digits)."
        );
        return;
      }
    }
  }

  setSaveLoading(true);
  try {
    const res = await UserAPI.put("/vehicle-information", vehicleInformation);
    if (res.data.success) {
      showPopup("success", "Vehicle Updated", res.data.message);
    }
  } catch (err) {
    showPopup(
      "error",
      "Update Failed",
      err.response?.data?.message || "Something went wrong"
    );
  } finally {
    setSaveLoading(false);
  }
};


  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await UserAPI.put('/update-email', { email: userInfo.email });
      if (res.data.success) {
        showPopup(
          'success',
          'Email updated successfully.',
          res.data.message,
          () => navigate('/dashboard')
        );
      }
    } catch (err) {
      showPopup(
        'error',
        'Email update error',
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password.currentpassword || !password.newpassword || !password.confirmnewpassword) {
      toast.error('Fields must not be empty.', toastOptions);
      return;
    }
    if (password.newpassword !== password.confirmnewpassword) {
      toast.error("New password and confirm password don't match", toastOptions);
      return;
    }
    setSaveLoading(true);
    try {
      const res = await UserAPI.put('/change-password', {
        currentpassword: password.currentpassword,
        newpassword: password.newpassword
      });
      if (res.data.success) {
        showPopup(
          'success',
          'Password changed successfully.',
          'You can now use your new password.',
          () => navigate('/dashboard')
        );
      }
    } catch (err) {
      showPopup(
        'error',
        'Change password failed',
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <UserHeader />

      <div className="flex justify-center items-center min-h-[90vh] my-5 md:my-0 px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg h-auto md:h-[80vh] overflow-y-auto md:overflow-hidden p-5">

          <div className="flex flex-col sm:flex-row md:flex-col items-center p-4 gap-2 w-full md:max-w-3xs md:items-start">
            <h2 className="hidden md:block text-lg font-semibold text-color mb-2">Settings</h2>

            <button
              onClick={() => setActiveSection("profile")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeSection === "profile" ? "bg-blue-100 text-color" : "hover:bg-gray-100 text-gray-600"}`}
            >
              <UserIcon className="w-5 h-5" />
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveSection("password")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeSection === "password" ? "bg-blue-100 text-color" : "hover:bg-gray-100 text-gray-600"}`}
            >
              <KeyIcon className="w-5 h-5" />
              <span>Password Information</span>
            </button>

            <button
              onClick={() => setActiveSection("vehicle")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeSection === "vehicle" ? "bg-blue-100 text-color" : "hover:bg-gray-100 text-gray-600"}`}
            >
              <IdentificationIcon className="w-5 h-5" />
              <span>Vehicle Information</span>
            </button>

            <button
              onClick={() => setActiveSection("violations")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                activeSection === "violations"
                  ? "bg-blue-100 text-color"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ExclamationTriangleIcon className='w-5 h-5'/>
              <span>Violations</span>
            </button>

          </div>

          <div className="w-full h-px md:h-full md:w-px bg-color-2"></div>

          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-xl font-semibold text-color text-center my-5">Account Settings</h2>

            {activeSection === "profile" && (
              <div className="flex flex-col gap-1 px-5">
                <h3 className="font-semibold text-lg text-color-3">Profile Information</h3>
                <div className="h-px bg-gray-200 mb-2"></div>
                <form className="flex flex-col gap-1">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input type="text" value={userInfo.lastname} readOnly className="p-2 border rounded-md text-sm w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input type="text" value={userInfo.firstname} readOnly className="p-2 border rounded-md text-sm w-full" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Middle Name</label>
                    <input type="text" name="middlename" value={userInfo.middlename} onChange={handleChange} className="p-2 border rounded-md text-sm w-full" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Student ID</label>
                    <input type="text" value={userInfo.studentId} readOnly className="p-2 border rounded-md text-sm w-full" />
                  </div>

                  <div className="col-span-2 relative">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      ref={inputRef}
                      type="email"
                      name="email"
                      onChange={handleChange}
                      readOnly={!isEditable}
                      value={userInfo.email}
                      className="w-full p-2 border rounded-md text-sm pr-10"
                    />
                    <PencilIcon onClick={handleEditClick} className="absolute right-3 top-9 w-4 h-4 text-gray-500 cursor-pointer hover:text-color-3" />
                  </div>
                </form>
                <button
                  onClick={handleChangeEmail}
                  className="w-full bg-color-3 cursor-pointer text-sm text-white py-2 rounded-md hover:opacity-90 transition mt-3"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeSection === "password" && (
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg text-color-3">Change Password</h3>
                <div className="h-px bg-gray-200 mb-2"></div>
                <form className="space-y-3">
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentpassword"
                      value={password.currentpassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-md text-sm pr-10"
                    />
                    {showPassword ? (
                      <EyeIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={togglePassword} />
                    ) : (
                      <EyeSlashIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={togglePassword} />
                    )}
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newpassword"
                      value={password.newpassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-md text-sm pr-10"
                    />
                    {showNewPassword ? (
                      <EyeIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={toggleNewPassword} />
                    ) : (
                      <EyeSlashIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={toggleNewPassword} />
                    )}
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmnewpassword"
                      value={password.confirmnewpassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-md text-sm pr-10"
                    />
                    {showConfirmPassword ? (
                      <EyeIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={toggleConfirmPassword} />
                    ) : (
                      <EyeSlashIcon className="absolute right-3 top-9 w-4 h-4 cursor-pointer text-gray-500" onClick={toggleConfirmPassword} />
                    )}
                  </div>
                </form>
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-color-3 text-white py-2 rounded-md cursor-pointer text-sm hover:opacity-90 transition mt-3"
                >
                  Save Password
                </button>
              </div>
            )}

            {activeSection === "vehicle" && (
              <div className="space-y-4 text-sm px-5">
                <h3 className="font-semibold text-lg text-color-3">Vehicle Information</h3>
                <div className="h-px bg-gray-200 mb-2"></div>

                <form className="flex flex-col gap-2">
                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label className="font-semibold text-color-3">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation?.vehicleType || ""}
                        onChange={(e) => {
                          const { value } = e.target;
                          setVehicleInformation((prev) => ({
                            ...prev,
                            vehicleType: value,
                            brand: ""
                          }));
                        }}
                      >
                        <option value="">Select Vehicle Type</option>
                        {Object.keys(brandsByType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="font-semibold text-color-3">Brand</label>
                      <select
                        name="brand"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation?.brand || ""}
                        onChange={handleVehicleChange}
                        disabled={!vehicleInformation.vehicleType}
                      >
                        <option value="">
                          {vehicleInformation.vehicleType ? "Select Brand" : "Select vehicle type first"}
                        </option>
                        {(brandsByType[vehicleInformation.vehicleType] || []).map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label className="font-semibold text-color-3">Model (Year)</label>
                      <select
                        name="model"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation?.model || ""}
                        onChange={handleVehicleChange}
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 47 }, (_, i) => 1980 + i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="font-semibold text-color-3">Plate Number</label>
                      <input
                        type="text"
                        name="plateNumber"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        placeholder="Enter Plate Number"
                        value={vehicleInformation?.plateNumber || ""}
                        onChange={handleVehicleChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label className="font-semibold text-color-3">Transmission</label>
                      <select
                        name="transmission"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation?.transmission || ""}
                        onChange={handleVehicleChange}
                      >
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="font-semibold text-color-3">Color</label>
                      <select
                        name="color"
                        className="outline-0 border rounded-md p-2 text-sm text-color-2 w-full"
                        value={vehicleInformation?.color || ""}
                        onChange={handleVehicleChange}
                      >
                        <option value="">Select Color</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Gray">Gray</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Silver">Silver</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </form>

                <button
                  onClick={handleSaveVehicle}
                  className="w-full bg-color-3 text-white py-2 rounded-md cursor-pointer text-sm hover:opacity-90 transition mt-3"
                >
                  Save Vehicle Info
                </button>
              </div>
            )}

          
            {activeSection === "violations" && (
              <div className="w-full px-5">
                <UserViolations userId={userInfo._id} />
              </div>
            )}

          </div>
        </div>
      </div>

      {loading && <Loader text="Loading information..." />}
      {saveLoading && <Loader text="Saving your changes..." />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        onClose={closePopup}
      />
    </>
  );
};

export default AccountSettings;
