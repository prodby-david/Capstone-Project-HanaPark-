import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AdminAPI from '../../../lib/inteceptors/adminInterceptor'
import UserAPI from '../../../lib/inteceptors/userInterceptor'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Step1 from '../../reservation/step1/step1';
import Step2 from '../../reservation/step2/step2';
import Step3 from '../../reservation/step3/step3';
import Step4 from '../../reservation/step4/step4';
import Step5 from '../../reservation/step5/step5';

const UserReservationForm = () => {

    const { slotId } = useParams();
    const [step, setStep] = useState(1);
    const [slot, setSlot] = useState(null); 
    
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState(''); 

    const [trackRadioBox, setTrackRadioBox] = useState(false);
    const navigate  = useNavigate();
    const [reservationResult, setReservationResult] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    {/* State use to hold all reservation form data */}
    const [reservationData, setReservationData] = useState({
        slotId,
        slotCode: '',
        slotPrice: 0,
        slotType: '',
        reservationDate: '',
        reservationTime: '',
        plateNumber: '',
        vehicleType: ''
    })

    {/* State use to get value in the vehicle input */}
    const [userVehicle, setUserVehicle] = useState({
        vehicleNumber: '',
        vehicleType: ''
    });

    {/* State use to hold user regstered vehicle into their account */}
    const [registeredVehicle, setRegisteredVehicle] = useState({
        vehicleNumber: '',
        vehicleType: ''
    });

    useEffect(() => {
        const now = new Date();

        const dateOptions = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "2-digit",
        };

        setReservationDate(new Intl.DateTimeFormat("en-PH", dateOptions).format(
        now
        ));

        const timeOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        };

        setReservationTime(new Intl.DateTimeFormat("en-PH", timeOptions).format(
        now
        ));

    }, []);


    useEffect(() => {
        const fetchSlots = async () => {
            try{
                const res = await UserAPI.get(`/slots/${slotId}`);
                setSlot(res.data);

                setReservationData(prev => ({
                    ...prev,
                    slotCode: res.data.slotNumber || res.data.slotCode || '',
                    slotPrice: res.data.price || res.data.slotPrice || 0,
                    slotType: res.data.type || res.data.slotType || ''
                }));
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
            const res = await UserAPI.get('/user-vehicle'); 
            const vehicle = res.data.vehicle; 

            setRegisteredVehicle({
                vehicleNumber: vehicle?.plateNumber || '',
                vehicleType: vehicle?.vehicleType || ''
            });
            } catch (err) {
            console.error('Error fetching user vehicle', err);
            }
        };
        getRegisteredVehicle();
    }, []);


    useEffect(() => {
        setReservationData(prev => ({
            ...prev,
            reservationDate,
            reservationTime, 
            arrivalTime,
        }));
    }, [reservationDate, reservationTime, arrivalTime]);


    useEffect(() => {
        setReservationData(prev => ({
            ...prev,
            plateNumber: userVehicle.vehicleNumber,
            vehicleType: userVehicle.vehicleType
        }));
    }, [userVehicle]);

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

        const nextStep = () => {
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

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const res = await UserAPI.post(`/reservation-form/${slotId}`, reservationData);
                setReservationResult(res.data);

                Swal.fire({
                    title: 'Slot reservation success!',
                    text: 'Press OK to continue.',
                    icon: 'success',
                    showConfirmButton: true,
                })

                nextStep();
                
            } catch (err) {
                Swal.fire({
                    title: 'Reservation failed',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Check reservations'
                })
            }
            
        }

  return (
    <>

       <div className='flex items-center justify-center gap-x-5 min-h-screen px-5'>
   
            {/* Reservation Steps Sidebar */}

            {step !== 5 && (
                <div className={`hidden md:flex flex-col items-start gap-y-5 p-10 bg-white shadow-md rounded-lg text-center w-full max-w-[300px] min-h-[400px]`}>

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
                        <ClipboardDocumentListIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Vehicle Information</p>
                    </li>

                    <li className={`${step === 4 ? 'text-color-3' : 'text-color-2'} flex items-center mb-3`}>
                        <div className={`${step === 4 ? 'block' : 'hidden'} h-6 w-1 bg-color-3 mr-2`}></div>
                        <CheckCircleIcon className='w-6 h-6 mr-2' />
                        <p className='font-semibold'>Confirmation</p>
                    </li>

                </ul>
 
            </div>
            )}

            {/* Reservation Form */}

             <div className='flex flex-col items-center justify-center gap-y-5 md:p-0 bg-white shadow-md rounded-lg text-center w-full max-w-2xl min-h-[400px]'>

                <form className='w-full'>

                    {/* Step 1: Spot Information */}

                    { step === 1 &&
                        <Step1 
                        slot={slot} 
                        nextStep={nextStep} 
                        /> 
                    }

                    {/* Step 2: Date and Time */}

                    {step === 2 && <Step2 
                        date={reservationDate}
                        reservationTime={reservationTime}
                        arrivalTime={arrivalTime}
                        setArrivalTime={setArrivalTime}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                    }

                    {/* Vehicle Information Form */}

                   {step === 3 && (
                        <Step3
                        userVehicle={userVehicle}
                        registeredVehicle={registeredVehicle}
                        trackRadioBox={trackRadioBox}
                        handleChange={handleChange}
                        handleRadioBox={handleRadioBox}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        slot={slot}
                        />
                    )}

                    {step === 4 && (
                        <Step4  
                        {...reservationData} 
                        prevStep={prevStep} 
                        nextStep={nextStep}
                        submit={handleSubmit}
                        />
                    )}

                     {step === 5 && (
                        <Step5 
                        reservationResult={reservationResult}
                        navigate={navigate} 
                        />
                    )}

                   
                </form>
                
            </div>

       </div>
    </>
  )
}

export default UserReservationForm;
