import React, { useState } from 'react'
import axios from 'axios'
const StudentRegistration = () => {

    const [ formData, setFormData ] = useState({
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

    const tertiaryCourses = [
        { value: "BSIT", label: "Bachelor of Science in Information Technology" },
        { value: "BSCS", label: "Bachelor of Science in Computer Science" },
        { value: "BSCpE", label: "Bachelor of Science in Computer Engineering" },
        { value: "BSAIS", label: "Bachelor of Science in Accounting Information System" },
        { value: "BSTM", label: "Bachelor of Science in Tourism Management" },
        { value: "BSBA", label: "Bachelor of Science in Business Administration" },
        { value: "BSHM", label: "Bachelor of Science in Hospitality Management" },
        { value: "BACOMM", label: "Bachelor of Arts in Communication" },
    ];

    const shsCourses = [
        { value: "STEM", label: "Science, Technology, Engineering and Mathematics" },
        { value: "ABM", label: "Accountancy, Business and Management" }
    ];

    const [ step, setStep ] = useState(1);
    const [ selectedCourse, setSelectedCourse ] = useState('');
    const [ selectedYearLevel, setselectedYearLevel ] = useState('');

    const filteredCourses = selectedYearLevel === "college"
    ? tertiaryCourses
    : selectedYearLevel === "shs"
    ? shsCourses
    : [];


const nextStep = () => setStep(prev => prev + 1);
const prevStep = () => setStep(prev => prev - 1);

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {

    e.preventDefault();

    try{
        const res = await axios.post('');

    }catch(err){
        
    }
    
  }

  return (
    <>
        <div className='flex flex-col items-center justify-center min-h-screen px-5'>

            <div className='flex flex-col border border-gray-300 rounded-lg p-6 shadow-lg bg-white w-full max-w-xl text-center'>

                <div className='mb-5'>
                    <h2 className='font-bold text-color text-xl'>Student Parking Registration</h2>
                </div>

                <form>
                {step === 1 && (
                    <div>

                        <div className='flex items-center mb-5'>
                            <h2 className='text-color-3'>
                                <span className='font-bold text-color'>Step 1:</span> Student Information
                            </h2>
                        </div>

                        <div className='flex flex-col gap-3'>

                            <div className='flex flex-col md:flex-row gap-3'>
                                <input type="text"
                                name="lastname"
                                id="Lastname"
                                placeholder='Last Name'
                                onChange={handleChange}
                                value={formData.lastname}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                />  

                                <input type="text"
                                name="firstname"
                                id="Firstname"
                                placeholder='First Name'
                                onChange={handleChange}
                                value={formData.firstname}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                                />  
                            </div>

                            <input type="text"
                            name="middlename"
                            id="Middlename"
                            placeholder='Middle Name (Optional)'
                            onChange={handleChange}
                            value={formData.middlename}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                            />  
                        </div>

                        <div className='flex flex-col md:flex-row gap-3 mt-3'>

                            <input type="text"
                            name="studentId"
                            id="studentId"
                            maxLength={10}
                            placeholder="Student ID Number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onChange={handleChange}
                            value={formData.studentId}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                            />

                            <input type="text"
                            name="username"
                            id="Username"
                            placeholder='Username'
                            onChange={handleChange}
                            value={formData.username}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                            />  

                        </div>

                        <div className='flex flex-col md:flex-row gap-3 mt-3'>

                            <input type="password"
                            name='password'
                            id='password'
                            placeholder='Password'
                            onChange={handleChange}
                            value={formData.password}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                            />

                            <input type="password"
                            name='confirmPassword'
                            id='ConfirmPassword'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                             value={formData.confirmPassword}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' 
                            />

                        </div>

                        <div className='flex flex-col gap-3 mt-3'>
                            <input type="email"
                            name='email'
                            id='Email'
                            placeholder='School Email Address'
                            onChange={handleChange}
                            value={formData.email}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'  />
                        </div>

                        <div className='flex flex-col md:flex-row gap-3 mt-3'>

                            <select 
                            name="yearLevel" 
                            id="YearLevel"
                            value={selectedYearLevel}
                            onChange={(e) => {
                                setselectedYearLevel(e.target.value);
                                setFormData({ ...formData, yearLevel: e.target.value, courses: '' });
                                setSelectedCourse('');
                            }}
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2 cursor-pointer'
                            >
                                <option value="" disabled>
                                    Student Year Level
                                </option>

                                <option value="shs">
                                    Senior High School
                                </option>

                                <option value="college">
                                    Tertiary
                                </option>

                            </select>

                             <select 
                                name="courses" 
                                id="Courses"
                                value={selectedCourse}
                                onChange={(e) => {
                                    setSelectedCourse(e.target.value);
                                    setFormData({ ...formData, courses: e.target.value });
                                }}
                                className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2 cursor-pointer'
                                >
                                    <option value="" disabled>
                                        Student Course
                                    </option>

                                {filteredCourses.map(course => (
                                <option key={course.value} value={course.value}>
                                {course.label}
                                </option>
                                ))}
                                
                            </select>

                        </div>

                        <div className='text-center mt-3'>
                            <h2 className='text-xs text-color-3'><span className='text-color font-semibold'>NOTE:</span> The username and password created by admin should be given or used by registered student when logging in into his/her account.</h2>
                        </div>

                        <div className='mt-3 flex justify-end'>
                            <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                            onClick={nextStep}>
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

                        <div>
                            <input type="text"
                            name='type'
                            id='Type'
                            value={formData.vehicleType}
                            onChange={handleChange}
                            placeholder='Vehicle Type'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />
                        </div>

                        <div className='flex gap-3 mt-3'>
                            <input type="text"
                            name='brand'
                            id='Vehiclename'
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder='Vehicle Brand'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'
                            />

                            <input type="Number"
                            name='model'
                            id='Model'
                            value={formData.model}
                            onChange={handleChange}
                            placeholder='Vehicle Year Model'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />

                        </div>

                        <div className='mt-3'>
                            <input type="text"
                            name='platenumber'
                            id='Platenumber'
                            value={formData.plateNumber}
                            onChange={handleChange}
                            placeholder='Plate Number or MV File'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />
                        </div>

                        <div className='flex gap-5 mt-3'>

                            <input type="text"
                            name='transmission'
                            id='Transmission'
                            value={formData.transmission}
                            onChange={handleChange}
                            placeholder='Transmission (Optional)'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2'
                            />
                            
                            <input type="text"
                            name='color'
                            id='Color'
                            value={formData.color}
                            onChange={handleChange}
                            placeholder='Vehicle Color'
                            className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />

                        </div>

                        <div className='text-center mt-3'>
                            <h2 className='text-xs text-color-3'><span className='text-color font-semibold'>NOTE:</span> After creating the account, the client should be able to register more vehicles.</h2>
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
                                onClick={nextStep}>
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
                        
                            <p><strong>Last Name:</strong> {formData.lastname}</p>
                            <p><strong>First Name:</strong> {formData.firstname}</p>
                            <p><strong>Middle Name:</strong> {formData.middlename}</p>
                            <p><strong>Student ID:</strong> {formData.studentId}</p>
                            <p><strong>Username:</strong> {formData.username}</p>
                            <p><strong>School Email:</strong> {formData.email}</p>
                            <p><strong>Year Level:</strong> {formData.yearLevel}</p>
                            <p><strong>Course:</strong> {formData.courses}</p>

                            <div className='w-full h-px bg-color-3 my-2'>
                                
                            </div>

                            <h2 className='text-color-3 mb-1 text-lg'>
                                <span className='font-bold text-color'>Step 2:</span> Student Vehicle Information
                            </h2>

                            <p><strong>Vehicle Type:</strong> {formData.type}</p>
                            <p><strong>Vehicle Brand:</strong> {formData.brand}</p>
                            <p><strong>Vehicle Model:</strong> {formData.model}</p>
                            <p><strong>Plate Number:</strong> {formData.platenumber}</p>
                            <p><strong>Transmission:</strong> {formData.transmission}</p>
                            <p><strong>Color:</strong> {formData.color}</p>
                        </div>

                        <div className='mt-3 flex justify-end gap-x-3'>

                            <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                            onClick={prevStep}>
                                Edit
                            </button>

                            <button className='text-sm text-white p-3 bg-color-3 w-[90px] cursor-pointer transition hover:opacity-75 duration-300'
                            onClick={nextStep}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                </form>

            </div>
        </div>
    </>
  )
}

export default StudentRegistration;
