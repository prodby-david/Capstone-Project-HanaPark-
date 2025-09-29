import React, {useState, useEffect} from 'react'
import Submit from '../../buttons/submit';
import AdminHeader from '../../../components/headers/adminHeader';




const StaffRegistration = () => {

    const [staffData, setStaffData] = useState({
        staffrole: '',
        lastname: '',
        firstname: '',
        username: '',
        personnelnumber: '',
        email: '',
        vehicleType: '',
        platenumber: ''
    })

const plateNumberRegex = /^(?:([A-Z]{3}\d{3}|\d{3}[A-Z]{3}|(?=(?:.*[A-Z]){3})(?=(?:.*\d){3})[A-Z0-9]{6})|([A-Z]{3}\d{4})|(\d{4}-\d{9,11}))$/;
const mvFileRegex = /^[0-9]{4}-[0-9]{11,12}$/;  
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;



  return (
    <>
        <AdminHeader />
        <div className='flex items-center justify-center min-h-[575px] px-5'>

            <div className='flex flex-col items-center justify-center bg-white shadow-sm shadow-black p-5 w-full max-w-lg'>

                <h2 className='font-semibold text-lg text-color'>School Personnel Registration</h2>

                <form className='flex flex-col gap-2 mt-5 w-full'>

                    <div className='flex flex-col w-full'>
                        <label htmlFor="StaffRoles" className='text-start text-color-3 text-sm font-semibold'>
                            Role Selection
                        </label>
                        <select name="staffrole" id="StaffRoles" className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm'>
                            <option value="">Select Role</option>
                            <option value="">Utilities</option>
                            <option value="">Instructor</option>
                            <option value="">Program Head</option>
                            <option value="">Admin</option>
                        </select>
                    </div>

                     <div className='flex gap-2'>
                        <div>
                            <label htmlFor="Lastname" className='text-start text-color-3 text-sm font-semibold'>
                            Last name
                            </label>
                            <input 
                            type="text"
                            name='lastname'
                            id='Lastname'
                            className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                        </div>

                        <div>
                            <label htmlFor="Firstname" className='text-start text-color-3 text-sm font-semibold'>
                            First name
                            </label>
                            <input 
                            type="text"
                            name='firstname'
                            id='Firstname'
                            className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="Username" className='text-start text-color-3 text-sm font-semibold'>
                            Username
                            </label>
                            <input 
                            type="text"
                            name='username'
                            id='Username'
                            className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                    </div>

                    <div className='flex gap-x-2'>
                        <div className='w-full'>
                            <label htmlFor="Password" className='text-start text-color-3 text-sm font-semibold'>
                                Password
                            </label>
                            <input 
                            type="password"
                            name='password'
                            id='Password'
                            className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                        </div>
                        <div className='w-full'>
                        <label htmlFor="ConfirmPassword" className='text-start text-color-3 text-sm font-semibold'>
                            Confirm Password
                            </label>
                            <input 
                            type="text"
                            name='confirmpassword'
                            id='ConfirmPassword'
                            className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                        </div>
                    </div>

                    <div className='flex gap-x-3'>
                        <div>
                        <label htmlFor="PersonnelNumber" className='text-start text-color-3 text-sm font-semibold'>
                            Personnel Number
                        </label>
                        <input 
                        type="number"
                        name='personnelnumber'
                        id='PersonnelNumber'
                        className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                    </div>
                    
                    <div>
                        <label htmlFor="Email" className='text-start text-color-3 text-sm font-semibold'>
                            Active Gmail Account
                        </label>
                        <input 
                        type="email"
                        name='email'
                        id='Email'
                        className='w-full outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2' />
                    </div>
                        
                </div>

                <div className='flex gap-x-3 items-center'>
                     <div className='w-full'>
                        <label htmlFor="Type"
                             className='text-start text-color-3 text-sm font-semibold'>Vehicle Type
                        </label>
                        <select 
                            name="vehicleType"
                            id="Type"
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

                    <div className='flex flex-col w-full mt-1'>
                        <label htmlFor="Platenumber"
                            className='text-start text-color-3 text-sm font-semibold'>
                            Plate Number or MV File
                        </label>
                        <input type="text"
                        name='plateNumber'
                        id='Platenumber'
                        placeholder='e.g 123ABC or 1234-00000012345'
                        className='w-full p-2 border focus:border-color-3 rounded focus:outline-none text-sm text-color-2' />
                    </div>

                </div>

                <div className='flex justify-end mt-1'>
                    <Submit />
                </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default StaffRegistration;
