import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import toastOptions from '../../../lib/toastConfig'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import AdminAPI from '../../../lib/inteceptors/adminInterceptor'
import AdminHeader from '../../../components/headers/adminHeader'
import CustomPopup from '../../../components/popups/popup'
import Loader from '../../../components/loaders/loader'


const UserRegistration = () => {

    const [ formData, setFormData ] = useState({
        userType: '',
        lastname: '',
        firstname: '',
        middlename: '',
        studentId:'',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        vehicleType: '',
        brand: '',
        model: '',
        plateNumber: '',
        transmission: '',
        color: ''
    });

    const [loading, setLoading] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null
    });

    const brandsByType = {
        "Small Motorcycle": ["Honda", "Yamaha", "Suzuki", "Kawasaki"],

        "Bigbike Motorcycle": ["Honda", "Yamaha", "Suzuki", "Kawasaki"],

        "2-Wheels (400cc and above)": ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Ducati", "BMW", "KTM", "Triumph"],

        "Sedan": ["Toyota","Honda","Mitsubishi","Nissan","Hyundai","Mazda","Chevrolet","Ford",],

        "Hatchback": ["Toyota", "Honda", "Suzuki", "Kia", "Hyundai", "Chevrolet"],

        "SUV": ["Toyota", "Honda", "Ford", "Mitsubishi", "Nissan", "Isuzu", "Hyundai", "Chevrolet"],

        "Pickup": ["Ford", "Isuzu", "Toyota", "Nissan", "Mitsubishi", "Mazda",],

        "MPV": ["Toyota", "Mitsubishi", "Suzuki", "Honda", "Nissan"],

        "Van": ["Toyota", "Nissan", "Hyundai", "Foton"],
    };

    const navigate = useNavigate();
    
    const [ step, setStep ] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const studentIdRegex = /^02000\d{6}$/;
    const usernameRegex = /^[a-zA-Z]+\.[0-9]{6}$/;
    const plateNumberRegex = /^(?:([A-Z]{3}\d{3}|\d{3}[A-Z]{3}|(?=(?:.*[A-Z]){3})(?=(?:.*\d){3})[A-Z0-9]{6})|([A-Z]{3}\d{4})|(\d{4}-\d{9,11}))$/;
    const mvFileRegex = /^[0-9]{4}-[0-9]{11,12}$/;  

    const filteredBrands = brandsByType[formData.vehicleType] || [];

const step1Validations = () => {

    if (!formData.userType) {
        toast.error('User Type must not be empty.', toastOptions);
        return false;
    }

    if (!formData.lastname) {
        toast.error('Lastname must not be empty.', toastOptions);
        return false;
    }

    if (formData.lastname.length < 2) {
        toast.error('Lastname must be atleast 2 characters.', toastOptions);
        return false;
    }

    if (formData.firstname.length < 2) {
        toast.error('Firstname must be atleast 2 characters.', toastOptions);
        return false;
    }

    if (!formData.firstname) {
        toast.error('Firstname must not be empty.', toastOptions);
        return false;
    }

    if(formData.middlename && !nameRegex.test(formData.middlename)){
        toast.error('Middlename must contain letters only', toastOptions);
        return false;
    }

    if (!nameRegex.test(formData.lastname) || !nameRegex.test(formData.firstname)) {
        toast.error("Names must contain letters only.", toastOptions);
        return false;
    }

    if(!formData.lastname){
        toast.error('Lastname must not be empty.', toastOptions)
        return false;
    }

    if (!formData.studentId) {
        toast.error("Student ID is required", toastOptions);
        return false;
    }

    if(formData.studentId.length < 11){
        toast.error('Student ID should be at least 11 digits long.', toastOptions);
        return;
    }

    if(!studentIdRegex.test(formData.studentId)){
        toast.error('Student ID format is invalid.', toastOptions)
        return;
    }

    if (!formData.username) {
        toast.error("Username is required", toastOptions);
        return false;
    }

    if(!usernameRegex.test(formData.username)){
        toast.error('Username format is invalid.', toastOptions)
        return;
    }

    if (!formData.password || !formData.confirmPassword) {
        toast.error("Password and confirm password are required", toastOptions);
        return false;
    }

    if(formData.password.length < 10){
        toast.error('Password must atleast 10 characters long.', toastOptions);
        return false;
    }

    if(formData.password !== formData.confirmPassword){
        toast.error("Password doesn't match. Try again.", toastOptions);
        return false;
    }
    
     if(!formData.email){
        toast.error('Email must not be empty.', toastOptions);
        return false;
    }

    if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format", toastOptions);
        return false;
    }

    return true;
};

const step2Validations = () => {

    if(!formData.vehicleType){
        toast.error("Vehicle Type is required.", toastOptions);
        return false;
    }

    if(!formData.model){
        toast.error("Year model is required.", toastOptions);
        return false;
    }

    if (!formData.plateNumber) {
        toast.error("Plate Number or MV File is required.", toastOptions);
        return false;
    }

    if (!plateNumberRegex.test(formData.plateNumber) && !mvFileRegex.test(formData.plateNumber)) {
        toast.error("Invalid Plate Number or MV File format. Use 123ABC or 1234-00000012345 format.", toastOptions);
        return false;
    }

    if (!formData.color) {
        toast.error("Vehicle color is required.", toastOptions);
        return false;
    }

  return true;
};


const nextStep = () => {

    if(step === 1){
        const valid = step1Validations();
        if(!valid) return;
    }

    if (step === 2) {
        const valid = step2Validations();
        if (!valid) return;
  }

    setStep(prev => prev + 1)
};

const prevStep = () => setStep(prev => prev - 1);

const toTitleCase = (str) =>
  str.toLowerCase().split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

const togglePassword = () => {
    setShowPassword(prev => !prev);
}

const toggleConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
}

const handleChange = (e) => {
  const { name, value } = e.target;

  const titleCaseFields = ['lastname', 'firstname', 'middlename', 'color'];
  const upperCaseFields = ['plateNumber'];

  let updatedValue = value;
  if (titleCaseFields.includes(name)) {
    updatedValue = toTitleCase(value);
  } else if (upperCaseFields.includes(name)) {
    updatedValue = value.toUpperCase();
  }

  const updatedFormData = {
    ...formData,
    [name]: updatedValue
  };

  if (
    (name === 'lastname' || name === 'studentId') &&
    updatedFormData.lastname &&
    studentIdRegex.test(updatedFormData.studentId)
  ) {
    const lastSixDigits = updatedFormData.studentId.slice(-6);
    const cleanedLastName = updatedFormData.lastname.replace(/\s+/g, '');
    const generatedUsername = `${cleanedLastName.toLowerCase()}.${lastSixDigits}`;
    updatedFormData.username = generatedUsername;
  }

  setFormData(updatedFormData);
};


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try{

        const res = await AdminAPI.post('/admin/student-registration', formData);

        if(res?.data?.success){
            setPopup({
                show: true,
                type: 'success',
                title: 'Registration Success',
                message: 'Click OK to continue.',
                onConfirm: () => {
                    setPopup(prev => ({ ...prev, show: false }));
                    navigate('/admin-dashboard');
                }
            });
        }

        setFormData({
            lastname: '',
            firstname: '',
            middlename: '',
            studentId:'',
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            courses: '',
            yearLevel: '',
            vehicleType: '',
            brand: '',
            model: '',
            plateNumber: '',
            transmission: '',
            color: ''
        });

    }catch(err){
        if(err.response){
            setPopup({
                show: true,
                type: 'error',
                title: 'Registration Failed',
                message: err.response.data.message,
                onConfirm: () => setPopup(prev => ({ ...prev, show: false }))
            });
        }
    } finally {
        setLoading(false);
    }
  }

  return (
  <>
    <AdminHeader />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-5 py-10">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-color">HanaPark Parking Registration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete the steps below to register a new user and vehicle.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6 space-x-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm ${
                step >= num
                  ? "bg-color-3 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <form>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="font-semibold text-lg text-color-3 mb-4">
                Step 1: <span className="text-color font-bold">User Information</span>
              </h3>

              <div className="space-y-3">
                {/* User Type */}
                <div>
                  <label className="text-sm font-semibold text-color-3">User Type</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                  >
                    <option value="">Select User Type</option>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-color-3">Lastname</label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="e.g. Dela Cruz"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-color-3">Firstname</label>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="e.g. Juan"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                  </div>
                </div>

                {/* Middlename */}
                <div>
                  <label className="text-sm font-semibold text-color-3">
                    Middlename (Optional)
                  </label>
                  <input
                    type="text"
                    name="middlename"
                    value={formData.middlename}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                  />
                </div>

                {/* Student ID + Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-color-3">User ID</label>
                    <input
                      type="text"
                      name="studentId"
                      placeholder="e.g. 02000123456"
                      maxLength={11}
                      inputMode="numeric"
                      value={formData.studentId}
                      onChange={handleChange}
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-color-3">Username</label>
                    <input
                      type="text"
                      name="username"
                      readOnly
                      value={formData.username}
                      className="w-full p-2 border rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed text-sm"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="text-sm font-semibold text-color-3">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                    {showPassword ? (
                      <EyeIcon
                        className="absolute right-3 top-8 w-5 h-5 text-color-2 cursor-pointer"
                        onClick={togglePassword}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="absolute right-3 top-8 w-5 h-5 text-color-2 cursor-pointer"
                        onClick={togglePassword}
                      />
                    )}
                  </div>

                  <div className="relative">
                    <label className="text-sm font-semibold text-color-3">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                    {showConfirmPassword ? (
                      <EyeIcon
                        className="absolute right-3 top-8 w-5 h-5 text-color-2 cursor-pointer"
                        onClick={toggleConfirmPassword}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="absolute right-3 top-8 w-5 h-5 text-color-2 cursor-pointer"
                        onClick={toggleConfirmPassword}
                      />
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-color-3">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. johndoe123@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                  />
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-5">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 text-sm text-white bg-color-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        {step === 2 && (
            <div className="animate-fade-in">
                <h3 className="font-semibold text-lg text-color-3 mb-4">
                Step 2: <span className="text-color font-bold">Student Vehicle Information</span>
                </h3>

                <div className="space-y-3">
                {/* Vehicle Type */}
                <div>
                    <label className="text-sm font-semibold text-color-3">Vehicle Type</label>
                    <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2 cursor-pointer"
                    >
                    <option value="">Select Vehicle Type</option>
                    <option value="Small Motorcycle">Small Motorcycle</option>
                    <option value="Bigbike Motorcycle">Bigbike Motorcycle</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="MPV">MPV</option>
                    <option value="Van">Van</option>
                    </select>
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                    <label className="text-sm font-semibold text-color-3">Brand</label>
                    <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2 cursor-pointer"
                    >
                        <option value="">
                        {filteredBrands.length === 0
                            ? "Select vehicle type first"
                            : "Select Brand"}
                        </option>
                        {filteredBrands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label className="text-sm font-semibold text-color-3">
                        Model (Year)
                    </label>
                    <select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2 cursor-pointer"
                    >
                        <option value="">Select Year</option>
                        {Array.from({ length: 47 }, (_, i) => 1980 + i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>

                {/* Plate Number */}
                <div>
                    <label className="text-sm font-semibold text-color-3">
                    Plate Number or MV File
                    </label>
                    <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    placeholder="e.g. 123ABC or 1234-00000012345"
                    className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2"
                    />
                </div>

                {/* Transmission & Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                    <label className="text-sm font-semibold text-color-3">
                        Transmission (Optional)
                    </label>
                    <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2 cursor-pointer"
                    >
                        <option value="">Select Transmission</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                    </div>

                    <div>
                    <label className="text-sm font-semibold text-color-3">Color</label>
                    <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:border-color-3 focus:ring-1 focus:ring-color-3 outline-none text-sm text-color-2 cursor-pointer"
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

                {/* Note */}
                <p className="text-xs text-center text-color-3 mt-3">
                    <span className="text-color font-semibold">NOTE:</span> The Plate Number or MV
                    File should be unique.
                </p>

                {/* Buttons */}
                <div className="flex justify-between mt-5">
                    <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 text-sm text-white bg-color-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                    >
                    Previous
                    </button>
                    <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 text-sm text-white bg-color-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                    >
                    Next
                    </button>
                </div>
                </div>
            </div>
            )}

            {step === 3 && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold text-lg text-color-3 mb-4">
                    Step 3: <span className="text-color font-bold">Data Preview</span>
                    </h3>

                    <div className="space-y-5 text-color-3 text-sm">
                    {/* Step 1 Preview */}
                    <div>
                        <h4 className="text-base font-semibold text-color mb-2">
                        Step 1: <span className="text-color-3 font-bold">Student Information</span>
                        </h4>

                        <div className="bg-gray-50 rounded-lg border p-4 space-y-1">
                        <p><strong>User Type:</strong> {formData.userType}</p>
                        <p><strong>Last Name:</strong> {formData.lastname}</p>
                        <p><strong>First Name:</strong> {formData.firstname}</p>
                        <p><strong>Middle Name (Optional):</strong> {formData.middlename || "—"}</p>
                        <p><strong>Student ID:</strong> {formData.studentId}</p>
                        <p><strong>Username:</strong> {formData.username}</p>
                        <p><strong>School Email:</strong> {formData.email}</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-color-3 opacity-50"></div>

                    {/* Step 2 Preview */}
                    <div>
                        <h4 className="text-base font-semibold text-color mb-2">
                        Step 2: <span className="text-color-3 font-bold">Student Vehicle Information</span>
                        </h4>

                        <div className="bg-gray-50 rounded-lg border p-4 space-y-1">
                        <p><strong>Vehicle Type:</strong> {formData.vehicleType}</p>
                        <p><strong>Vehicle Brand:</strong> {formData.brand}</p>
                        <p><strong>Vehicle Model:</strong> {formData.model}</p>
                        <p><strong>Plate Number:</strong> {formData.plateNumber}</p>
                        <p><strong>Transmission (Optional):</strong> {formData.transmission || "—"}</p>
                        <p><strong>Color:</strong> {formData.color}</p>
                        </div>
                    </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 text-sm text-white bg-color-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm text-white bg-color-3 rounded-lg shadow-md hover:opacity-90 transition duration-300"
                    >
                        Submit
                    </button>
                    </div>
                </div>
                )}

          {/* STEP 2 & STEP 3 remain same logic */}
          {/* You can wrap them in similar modern style using rounded-lg, spacing, and hover transitions */}
        </form>
      </div>
    </div>

    {loading && <Loader />}

    <CustomPopup
      show={popup.show}
      type={popup.type}
      title={popup.title}
      message={popup.message}
      onConfirm={popup.onConfirm}
      onClose={() => setPopup((prev) => ({ ...prev, show: false }))}
    />
  </>
);

}

export default UserRegistration;
