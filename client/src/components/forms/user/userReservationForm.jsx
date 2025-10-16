import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import AdminAPI from '../../../lib/inteceptors/adminInterceptor';
import UserAPI from '../../../lib/inteceptors/userInterceptor';
import Swal from 'sweetalert2';
import Step1 from '../../reservation/step1/step1';
import Step2 from '../../reservation/step2/step2';
import Step3 from '../../reservation/step3/step3';
import Step4 from '../../reservation/step4/step4';
import Step5 from '../../reservation/step5/step5';
import Loader from '../../../components/loaders/loader';

const UserReservationForm = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [slot, setSlot] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [trackRadioBox, setTrackRadioBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);

  const [reservationData, setReservationData] = useState({
    slotId,
    slotCode: '',
    slotPrice: 0,
    slotType: '',
    reservationDate: '',
    reservationTime: '',
    plateNumber: '',
    vehicleType: '',
  });

  const [userVehicle, setUserVehicle] = useState({
    vehicleNumber: '',
    vehicleType: '',
  });

  const [registeredVehicle, setRegisteredVehicle] = useState({
    vehicleNumber: '',
    vehicleType: '',
  });

  useEffect(() => {
    const now = new Date();
    const dateOptions = { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: '2-digit' };
    const timeOptions = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true };

    setReservationDate(new Intl.DateTimeFormat('en-PH', dateOptions).format(now));
    setReservationTime(new Intl.DateTimeFormat('en-PH', timeOptions).format(now));
  }, []);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const res = await UserAPI.get(`/slots/${slotId}`);
        const data = res.data;
        setSlot(data);
        setReservationData((prev) => ({
          ...prev,
          slotCode: data.slotNumber || data.slotCode || '',
          slotPrice: data.price || data.slotPrice || 0,
          slotType: data.type || data.slotType || '',
        }));
      } catch (err) {
        console.error('Error fetching slot:', err);
      }
    };
    fetchSlot();
  }, [slotId]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await UserAPI.get('/user-vehicle');
        const vehicle = res.data.vehicle || {};
        setRegisteredVehicle({
          vehicleNumber: vehicle.plateNumber || '',
          vehicleType: vehicle.vehicleType || '',
        });
      } catch (err) {
        console.error('Error fetching user vehicle:', err);
      }
    };
    fetchVehicle();
  }, []);

  // 🔁 Sync data
  useEffect(() => {
    setReservationData((prev) => ({
      ...prev,
      reservationDate,
      reservationTime,
      arrivalTime,
    }));
  }, [reservationDate, reservationTime, arrivalTime]);

  useEffect(() => {
    setReservationData((prev) => ({
      ...prev,
      plateNumber: userVehicle.vehicleNumber,
      vehicleType: userVehicle.vehicleType,
    }));
  }, [userVehicle]);

  const handleRadioBox = (e) => {
    const checked = e.target.checked;
    setTrackRadioBox(checked);
    setUserVehicle(
      checked
        ? { vehicleNumber: registeredVehicle.vehicleNumber, vehicleType: registeredVehicle.vehicleType }
        : { vehicleNumber: '', vehicleType: '' }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await UserAPI.post(`/reservation-form/${slotId}`, reservationData);
      setReservationResult(res.data);
      Swal.fire({
        title: 'Reservation Confirmed!',
        text: 'Thank you for reserving a slot at HanaPark.',
        icon: 'success',
        confirmButtonColor: '#00509e',
      });
      nextStep();
    } catch (err) {
      Swal.fire({
        title: 'Reservation Failed',
        text: err.response?.data?.message || 'Something went wrong.',
        icon: 'error',
        confirmButtonColor: '#00509e',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-10 gap-8">
        {/* Sidebar */}
        {step !== 5 && (
          <div className="hidden lg:flex flex-col gap-y-6 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-8 w-full max-w-xs border border-gray-100">
            <h2 className="text-lg font-semibold text-[#00509e] text-center">Reservation Steps</h2>

            <ul className="space-y-4">
              {[
                { icon: MapPinIcon, label: 'Spot Information' },
                { icon: CalendarIcon, label: 'Date & Time' },
                { icon: ClipboardDocumentListIcon, label: 'Vehicle Information' },
                { icon: CheckCircleIcon, label: 'Confirmation' },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-3 transition ${
                    step === index + 1 ? 'text-[#00509e] font-semibold' : 'text-gray-500'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${step === index + 1 ? 'text-[#00509e]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl w-full max-w-3xl p-6 sm:p-10 transition-all border border-gray-100">
          <form className="w-full">
            {step === 1 && <Step1 slot={slot} nextStep={nextStep} />}
            {step === 2 && (
              <Step2
                date={reservationDate}
                reservationTime={reservationTime}
                arrivalTime={arrivalTime}
                setArrivalTime={setArrivalTime}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
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
              <Step4 {...reservationData} prevStep={prevStep} nextStep={nextStep} submit={handleSubmit} />
            )}
            {step === 5 && <Step5 reservationResult={reservationResult} navigate={navigate} />}
          </form>
        </div>
      </div>

      {loading && <Loader text="Confirming reservation..." />}
    </>
  );
};

export default UserReservationForm;
