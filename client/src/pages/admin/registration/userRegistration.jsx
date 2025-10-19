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
        <div className='flex flex-col items-center justify-center mt-2 px-5'>

            <div className='flex flex-col border border-gray-300 rounded-lg px-6 py-4 shadow-lg bg-white w-full max-w-xl text-center'>

                <div className='mb-5'>
                    <h2 className='font-bold text-color text-xl'>HanaPark Parking Registration</h2>
                </div>

                <form>
                {step === 1 && (
                    <div>

                        <div className='flex items-center mb-5'>
                            <h2 className='text-color-3'>
                                <span className='font-bold text-color'>Step 1:</span> User Information
                            </h2>
                        </div>

                        <div className='flex flex-col gap-2'>

                            <div className='flex flex-col w-full'>

                                    <label htmlFor="UserType"
                                    className='text-start text-color-3 text-sm font-semibold'>User Type</label>
                                    
                                   <select 
                                   className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                   name="userType" 
                                   id="UserType"
                                   value={formData.userType}
                                   onChange={handleChange}>
                                    <option value="">Select User Type</option>
                                    <option value="Student">Student</option>
                                    <option value="Staff">Staff</option>
                                   </select>

                                </div>

                            <div className='flex flex-col md:flex-row gap-x-3'>
                                

                                <div className='flex flex-col w-full'>

                                    <label htmlFor="Lastname"
                                    className='text-start text-color-3 text-sm font-semibold'>Lastname</label>
                                    
                                    <input type="text"
                                    name="lastname"
                                    id="Lastname"
                                    placeholder='e.g. Dela Cruz' 
                                    onChange={handleChange}
                                    value={formData.lastname}
                                    className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                    />  

                                </div>

                                <div className='flex flex-col w-full'>

                                    <label htmlFor="Firstname"
                                    className='text-start text-color-3 text-sm font-semibold'>Firstname</label>

                                    <input type="text"
                                    name="firstname"
                                    id="Firstname"
                                    placeholder='e.g. Juan'
                                    onChange={handleChange}
                                    value={formData.firstname}
                                    className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                    />  
                                </div>
                                
                            </div>

                            <div className='flex flex-col w-full'>

                                <label htmlFor="Firstname"
                                className='text-start text-color-3 text-sm font-semibold'>Middlename (Optional)</label>

                                <input type="text"
                                name="middlename"
                                id="Middlename"
                                onChange={handleChange}
                                value={formData.middlename}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                />  

                            </div>
                           
                        </div>

                        <div className='flex flex-col md:flex-row gap-3 mt-2'>

                            <div className='flex flex-col w-full'>

                                <label htmlFor="StudentId"
                                className='text-start text-color-3 text-sm font-semibold'>User ID
                                </label>

                                <input type="text"
                                name="studentId"
                                id="StudentId"
                                placeholder='e.g. 02000123456'
                                maxLength={11}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onChange={handleChange}
                                value={formData.studentId}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                />

                            </div>
                           
                            <div className='flex flex-col w-full'>
                            
                                <label htmlFor="Username"
                                className='text-start text-color-3 text-sm font-semibold'>Username
                                </label>

                                <input
                                type="text"
                                name="username"
                                id="Username"
                                value={formData.username}
                                readOnly
                                className="w-full p-2 border text-gray-500 rounded text-sm cursor-not-allowed"
                                />
 
                            </div>
        
                        </div>

                        <div className='flex flex-col md:flex-row gap-3 mt-2'>
                            
                            <div className='flex flex-col w-full'>

                                <label htmlFor="Password"
                                className='text-start text-color-3 text-sm font-semibold'>Password
                                </label>
                                
                                <div className='relative'>

                                    <input type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    id='Password'
                                    onChange={handleChange}
                                    value={formData.password}
                                    className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                    />

                                    {showPassword ? (
                                        <EyeIcon
                                        className='absolute right-3 top-3 w-5 h-5 text-color-2 cursor-pointer'
                                        onClick={togglePassword}
                                        />
                                    ) : (
                                        <EyeSlashIcon
                                        className='absolute right-3 top-3 w-5 h-5 text-color-2 cursor-pointer'
                                        onClick={togglePassword}
                                        />
                                    )}

                                </div>
                                

                            </div>
                            
                            <div className='flex flex-col w-full'>

                                <label htmlFor="ConfirmPassword"
                                className='text-start text-color-3 text-sm font-semibold'>Confirm Password
                                </label>
                                
                                <div className='relative'>
                                    <input type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    id='ConfirmPassword'
                                    onChange={handleChange}
                                    value={formData.confirmPassword}
                                    className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                    />

                                    {showConfirmPassword ? (
                                        <EyeIcon
                                        className='absolute right-3 top-3 w-5 h-5 text-color-2 cursor-pointer'
                                        onClick={toggleConfirmPassword}
                                        />
                                    ) : (
                                        <EyeSlashIcon
                                        className='absolute right-3 top-3 w-5 h-5 text-color-2 cursor-pointer'
                                        onClick={toggleConfirmPassword}
                                        />
                                    )}

                                </div>
                               
                            </div>
                           
                        </div>

                        <div className='flex flex-col gap-3 mt-1'>

                            <div className='flex flex-col w-full'>
                                
                                <label htmlFor="Email"
                                className='text-start text-color-3 text-sm font-semibold'>Email Address
                                </label>
                                
                                <input type="email"
                                name='email'
                                id='Email'
                                placeholder='e.g. johndoe123@gmail.com'
                                onChange={handleChange}
                                value={formData.email}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'  
                                />

                            </div>
                            
                        </div>

                        <div className='mt-3 flex justify-end'>
                            <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                            onClick={nextStep}
                            type='button'>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>

                        <div className='flex items-center mb-5'>
                            <h2 className='text-color-3'>
                                <span className='font-bold text-color'>Step 2:</span> Student Vehicle Information
                            </h2>
                        </div>

                        <div className='flex flex-col w-full'>

                            <label htmlFor="Type"
                             className='text-start text-color-3 text-sm font-semibold'>Vehicle Type
                             </label>

                            <select 
                            name="vehicleType"
                            id="Type"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2 cursor-pointer'
                            >
                            <option value="" disabled>
                                Vehicle Type
                            </option>

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

                        <div className='flex gap-3 mt-3'>

                        <div className='flex flex-col w-full'>

                            <label htmlFor="Brand" 
                            className='text-start text-color-3 text-sm font-semibold'>
                                Brand
                            </label>

                            <select
                                name="brand"
                                id="Brand"
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2 cursor-pointer'
                                value={formData.brand}
                                onChange={handleChange}
                            >
                               <option value="" disabled>
                                    {filteredBrands.length === 0 ? "Select vehicle type first" : "Select Brand"}
                                </option>

                                {filteredBrands.map((brand) => (
                                    <option key={brand} value={brand}>
                                    {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        
                        <div className='flex flex-col items-start w-full'>

                            <label htmlFor='Model' className="font-semibold text-sm text-color-3">
                                Model (Year)
                            </label>
                            <select
                            name="model"
                            id='Model'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'
                            value={formData.model}
                            onChange={handleChange}
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

                        <div className='flex flex-col mt-3'>

                            <label htmlFor="Platenumber"
                            className='text-start text-color-3 text-sm font-semibold'>
                                Plate Number or MV File
                            </label>

                            <input type="text"
                            name='plateNumber'
                            id='Platenumber'
                            value={formData.plateNumber}
                            onChange={handleChange}
                            placeholder='e.g 123ABC or 1234-00000012345'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />

                        </div>

                        <div className='flex gap-x-3 mt-3'>

                            <div className='flex flex-col w-full'>

                                <label htmlFor="Transmission"
                                className='text-start text-color-3 text-sm font-semibold'>
                                    Transmission (Optional)
                                </label>

                                <select 
                                name="transmission" 
                                id="Transmission"
                                value={formData.transmission}
                                onChange={handleChange}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'
                                >
                                    <option value="" disabled></option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>

                            </div>
                         
                            <div className='flex flex-col items-start w-full'>

                                <label htmlFor='Color' className="font-semibold text-sm text-color-3">Color</label>
                                <select
                                name="color"
                                id='Color'
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                value={formData.color}
                                onChange={handleChange}
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

                        <div className='text-center mt-3'>
                            <h2 className='text-xs text-color-3'><span className='text-color font-semibold'>NOTE:</span> The Plate Number or MV File should be unique.</h2>
                        </div>

                        <div className='flex gap-x-5 justify-end'>

                            <div className='mt-3'>
                                <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                                onClick={prevStep}>
                                    Previous
                                </button>
                            </div>

                            <div className='mt-3'>
                                <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                                onClick={nextStep} type='button'>
                                    Next
                                </button>
                            </div>
                        </div>
                       
                    </div>
                )}

                {step == 3 && (
                    <div>
                        <div className='mb-3'>
                            <h2 className='font-bold text-color-3 text-[28px]'> Data Preview</h2>
                        </div>

                        <div className='text-left text-color-3'>

                       
                        <h2 className='text-color-3 mb-1 text-lg'>
                            <span className='font-bold text-color'>Step 1:</span> Student Information
                        </h2>

                            <p><strong>User Type:</strong> {formData.userType}</p>
                            <p><strong>Last Name:</strong> {formData.lastname}</p>
                            <p><strong>First Name:</strong> {formData.firstname}</p>
                            <p><strong>Middle Name (Optional):</strong> {formData.middlename}</p>
                            <p><strong>Student ID:</strong> {formData.studentId}</p>
                            <p><strong>Username:</strong> {formData.username}</p>
                            <p><strong>School Email:</strong> {formData.email}</p>
    
                            <div className='w-full h-px bg-color-3 my-2'>
                                
                            </div>

                            <h2 className='text-color-3 mb-1 text-lg'>
                                <span className='font-bold text-color'>Step 2:</span> Student Vehicle Information
                            </h2>

                            <p><strong>Vehicle Type:</strong> {formData.vehicleType}</p>
                            <p><strong>Vehicle Brand:</strong> {formData.brand}</p>
                            <p><strong>Vehicle Model:</strong> {formData.model}</p>
                            <p><strong>Plate Number:</strong> {formData.plateNumber}</p>
                            <p><strong>Transmission (Optional): </strong> {formData.transmission}</p>
                            <p><strong>Color:</strong> {formData.color}</p>
                        </div>

                        <div className='mt-3 flex justify-end gap-x-3'>

                            <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                            onClick={prevStep}>
                                Edit
                            </button>

                            <button type='button' className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300' onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}

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
            onClose={() => setPopup(prev => ({ ...prev, show: false }))}
        />
    </>
  )
}

export default UserRegistration;
