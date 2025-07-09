import React, { useState } from 'react'
import { MapPinIcon, CalendarIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';




const UserReservationForm = () => {

const [step, setStep] = useState(1);

const nextStep = () => {
    setStep(prevStep => prevStep + 1);
}

const prevStep = () => {
    setStep(prevStep => prevStep - 1);
}


const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
 }


  return (
    <>

       <div className='flex items-center justify-center gap-x-10 min-h-screen px-5'>
   
            {/* Reservation Steps Sidebar */}

            <div className='flex flex-col items-start gap-y-5 p-10 bg-white shadow-md rounded-lg text-center w-full max-w-[300px] min-h-[400px]'>

                <h2 className='text-xl text-color font-semibold'>Reserve a spot</h2>

                <ul className='text-md ml-3'>
                    
                    <li className={`${step === 1 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 1 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <MapPinIcon className='w-6 h-6  mr-2' />
                        <p className='font-semibold'>Spot Location</p>
                    </li>

                    <li className={`${step === 2 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 2 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <CalendarIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Date and Time</p>
                    </li>

                    <li className='flex items-center mb-3 text-color-2'>
                        <ClipboardDocumentListIcon className='w-6 h-6 mr-2' />
                        <p className=' font-semibold'>Vehicle Info</p>
                    </li>

                    <li className='flex items-center mb-3 text-color-2'>
                        <CheckCircleIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Confirmation</p>
                    </li>
                </ul>
 
            </div>

            {/* Reservation Form */}

             <div className='flex flex-col items-center justify-center gap-y-5 py-10 bg-white shadow-md rounded-lg text-center w-full max-w-4xl min-h-[400px]'>

                <form>

                    {/* Step 1: Site Location */}
                    {step === 1 && (
                        <div>

                            <h2 className='font-semibold'>Specify your reservation details:</h2>

                            <div className='flex flex-col gap-y-2 mt-5'>
                                <label htmlFor="">Building</label>
                                <select name="" id="">
                                    <option value="">Select Building</option>
                                    <option value="">Building 1</option>
                                    <option value="">Building 2</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor=""></label>
                            </div>

                            <button onClick={nextStep}>
                                Next
                            </button>

                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className='font-semibold'>Select Date and Time:</h2>

                            <div className='flex flex-col gap-y-2 mt-5'>
                                <label htmlFor="date">Date</label>
                                <input type="date" name="date" id="date" className='border p-2 rounded-md' />
                            </div>

                            <div className='flex flex-col gap-y-2 mt-5'>
                                <label htmlFor="time">Time</label>
                                <input type="time" name="time" id="time" className='border p-2 rounded-md' />
                            </div>

                            <button onClick={prevStep}>
                                Back
                            </button>

                            <button onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    )}
                   
                    
                    
                    
                </form>
                
            </div>

       </div>
    </>
  )
}

export default UserReservationForm;
