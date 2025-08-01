import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, ClipboardDocumentListIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import NextButton from '../../buttons/nextbutton';
import BackButton from '../../buttons/backbutton'
import { api } from '../../../lib/api';

const UserReservationForm = () => {

    const [step, setStep] = useState(1);
    const { slotId } = useParams();
    const [slot, setSlot] = useState(null); 
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [trackRadioBox, setTrackRadioBox] = useState(false);
    const [userVehicle, setUserVehicle] = useState({
        vehicleNumber: '',
        vehicleType: ''
    });
    const [registeredVehicle, setRegisteredVehicle] = useState({
        vehicleNumber: '',
        vehicleType: ''
    });


    
    useEffect(() => {

        const updateClock = () => {

            const now = new Date();

            const timeString = now.toLocaleTimeString();  

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1);
            const day = String(now.getDate());
            const dateString = `${month}-${day}-${year}`;
                setTime(timeString);
                setDate(dateString);
        };

        updateClock(); 
        const interval = setInterval(updateClock, 1000); 

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const fetchSlots = async () => {
            try{
                const res = await api.get(`http://localhost:4100/admin/slots/${slotId}`);
                setSlot(res.data);
            }
            catch(err){
                console.error('Error fetching slots', err);
            }
        }
        fetchSlots();
    }, [slotId]);


    useEffect(() => {
        const getRegisteredVehicle = async () => {
            try {
                const registeredVehicle = await api.get('/user-vehicle');
                const firstVehicle = registeredVehicle.data.vehicles?.[0]; 
      
                setRegisteredVehicle({
                    vehicleNumber: firstVehicle?.plateNumber || '',
                    vehicleType: firstVehicle?.vehicleType || ''
                });
            } 
            catch(err) {
                console.error('Error fetching user vehicles', err);
            }
        }
        getRegisteredVehicle();
    }, []);

    const handleRadioBox = (e) => {
        const checked = e.target.checked;
        setTrackRadioBox(checked);

        if (checked) {
            setUserVehicle({
            vehicleNumber: registeredVehicle.vehicleNumber,
            vehicleType: registeredVehicle.vehicleType,
            });
        } else {
            setUserVehicle({
            vehicleNumber: '',
            vehicleType: ''
            });
        }
    };


        const nextStep = (e) => {
            e.preventDefault();
            setStep(prevStep => prevStep + 1);
        }

        const prevStep = (e) => {
            e.preventDefault();
            setStep(prevStep => prevStep - 1);
        }

        const handleChange = (e) => {
            const {name, value} = e.target;
            setUserVehicle(prev => ({ ...prev, [name]: value }));
        }


  return (
    <>

       <div className='flex items-center justify-center gap-x-10 min-h-screen px-5'>
   
            {/* Reservation Steps Sidebar */}

            <div className='hidden md:flex flex-col items-start gap-y-5 p-10 bg-white shadow-md rounded-lg text-center w-full max-w-[300px] min-h-[400px]'>

                <h2 className='text-xl text-color font-semibold'>Reserve a spot</h2>

                <ul className='text-md ml-3'>
                    
                    <li className={`${step === 1 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 1 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <MapPinIcon className='w-6 h-6  mr-2' />
                        <p className='font-semibold'>Spot Information</p>
                    </li>

                    <li className={`${step === 2 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 2 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <CalendarIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Date and Time</p>
                    </li>

                    <li className={`${step === 3 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 3 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <CalendarIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Vehicle Information</p>
                    </li>

                    <li className='flex items-center mb-3 text-color-2'>
                        <CheckCircleIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Confirmation</p>
                    </li>

                </ul>
 
            </div>

            {/* Reservation Form */}

             <div className='flex flex-col items-center justify-center gap-y-5 py-10 bg-white shadow-md rounded-lg text-center w-full max-w-4xl min-h-[400px]'>

                <form className='w-full'>

                    {/* Step 1: Site Location */}
                    {step === 1 && (
                        <div> 
                           {slot ? (
                                <div className='flex flex-col items-center gap-5'>

                                    <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

                                        <label 
                                        htmlFor="slotNumber"
                                        className='font-semibold text-color'>
                                            Selected Slot Code
                                        </label>

                                        <input 
                                        type="text"
                                        id='slotNumber'
                                        readOnly
                                        value={slot.slotNumber}
                                        className='w-full outline-0 border p-2 border-color-2 rounded-md text-sm text-color-2 cursor-default' 
                                        />
                                        
                                    </div>

                                     <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

                                        <label 
                                        htmlFor="slotType"
                                        className='font-semibold text-color '>
                                            Parking Slot Type
                                        </label>

                                        <input 
                                        type="text"
                                        id='slotType'
                                        readOnly
                                        value= {slot.slotType}
                                        className='w-full outline-0 border p-2 border-color-2 rounded-md text-sm text-color-2 cursor-default' 
                                        />
                                        
                                    </div>

                                    <div className='flex items-center justify-center gap-x-2'>
                                        <NextButton onClick={nextStep}/>
                                    </div>
                                    

                                </div>
                            ) : (
                                <p>Loading slot info...</p>
                            )}

                             
                        </div>
                    )}

                    {step === 2 && (
                        <div className='flex flex-col justify-center items-center relative'>

                            <div className='font-semibold absolute -top-10 right-15'>
                                 <p className='text-color'><span className='text-color-2'>Time:</span>      {time}
                                 </p>
                            </div>

                            <div className='flex flex-col gap-y-2 mt-5'>
                                <label htmlFor="date" className='font-semibold text-color'>Reservation Date</label>
                                <input 
                                type="text" 
                                name="date" 
                                value={date}
                                readOnly
                                id="date" 
                                className='border p-2 rounded-md w-full max-w-sm text-center font-semibold' 
                                />
                            </div>

                            <div className='flex flex-col gap-y-2 mt-5'>
                                <label htmlFor="time" className='font-semibold text-color'>Arrival Time</label>
                                <input 
                                type="time" 
                                name="time" 
                                id="time" 
                                className='border p-2 rounded-md w-full max-w-sm cursor-pointer' 
                                />
                            </div>

                            <div className='flex gap-2 items-center justify-center mt-5'>
                                <BackButton onClick={prevStep}/>
                                <NextButton onClick={nextStep}/>
                            </div>
                           
                        </div>
                    )}
                    {step === 3 && (
                        <div className='flex flex-col items-center gap-3'>

                            <h2 className='text-lg font-semibold text-color'>Vehicle Information</h2>

                            <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

                                <label 
                                htmlFor="vehicleNumber" 
                                className='font-semibold text-color'>Vehicle Plate Number
                                </label>

                                <input 
                                type="text" 
                                id="vehicleNumber" 
                                name="vehicleNumber"
                                value={userVehicle.vehicleNumber}
                                disabled={trackRadioBox}
                                onChange={handleChange}
                                className='w-full outline-0 border p-2 border-color-2 rounded-md text-sm text-color-2' 
                                />
                            </div>

                            <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

                                <label 
                                htmlFor="vehicleType" 
                                className='font-semibold text-color'>
                                    Vehicle Type
                                </label>

                                <input 
                                type="text" 
                                id="vehicleType" 
                                name="vehicleType"
                                onChange={handleChange}
                                disabled={trackRadioBox}
                                value={userVehicle.vehicleType}
                                className='w-full outline-0 border p-2 border-color-2 rounded-md text-sm text-color-2' 
                                />

                                <div className='flex items-center gap-x-1'>

                                    <input type="checkbox"
                                    id='RegVehicle'
                                    name='useRegisteredVehicleCheckbox'
                                    onChange={handleRadioBox}
                                    className='cursor-pointer'
                                    />

                                    <label 
                                        htmlFor="RegVehicle" 
                                        className='text-sm'
                                        >Use your registered vehicle in to your account
                                    </label>

                                </div>

                            </div>

                            <div className='flex flex-col gap-2  mt-5'>

                                <h2 
                                    className='text-xs text-color-3 w-sm'><span className='text-color font-semibold'>NOTE:</span> If you are using another vehicle, please fill out the form. If not, just click the checkbox then proceed.
                                </h2>

                                <div className='flex items-center justify-center gap-x-3 mt-2'>
                                    <BackButton onClick={prevStep}/>
                                    <NextButton onClick={nextStep}/>
                                </div>
                                
                            </div>

                        </div>
                    )}
                   
                </form>
                
            </div>

       </div>
    </>
  )
}

export default UserReservationForm;
