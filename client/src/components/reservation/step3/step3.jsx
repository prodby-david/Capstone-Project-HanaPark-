import React from 'react';
import BackButton from '../../buttons/backbutton';
import NextButton from '../../buttons/nextbutton';
import { toast } from 'react-toastify';
import toastOptions from '../../../lib/toastConfig';
import PlateNumberInput from './plateNumberInput';
import VehicleTypeInput from './vehicleTypeInput';

const plateNumberRegex = /^(?:([A-Z]{3}\d{3}|\d{3}[A-Z]{3}|(?=(?:.*[A-Z]){3})(?=(?:.*\d){3})[A-Z0-9]{6})|([A-Z]{3}\d{4})|(\d{4}-\d{9,11}))$/;

const Step3 = ({
  userVehicle,
  registeredVehicle,
  trackRadioBox,
  handleChange,
  handleRadioBox,
  prevStep,
  nextStep,
  slot
}) => {

  const handleNext = () => {

    const { vehicleNumber, vehicleType } = userVehicle;
    const slotType = slot?.slotType || '';

    if(!vehicleNumber || !vehicleType) {
      toast.error('Please fill in all vehicle information fields.', toastOptions);
      return;
    }

    if(!plateNumberRegex.test(vehicleNumber)) {
      toast.error('Invalid plate number format. Please use the correct format.', toastOptions);
      return;
    }

    if (["Sedan", "Hatchback", "SUV", "Pickup", "MPV", "Van"].includes(vehicleType) 
        && slotType.includes("2-Wheels")) {
      toast.error("4-Wheels vehicle cannot reserve motorcycle slots.", toastOptions);
      return;
    }

    if (vehicleType.includes("2-Wheels") && slotType === "4-Wheels") {
      toast.error("Motorcycles cannot reserve 4-wheels slot.", toastOptions);
      return;
    }

    if (vehicleType === '4-Wheels' && slotType.includes('2-Wheels')) {
      toast.error('4-Wheels vehicle cannot reserve motorcycle slots.', toastOptions);
      return;
    }

    if (vehicleType.includes('2-Wheels') && slotType === '4-Wheels') {
      toast.error('Motorcycles cannot reserve 4-wheels slot.', toastOptions);
      return;
    }

    nextStep();
  }

  
  return (

    <>
    
    <div className='flex flex-col items-center gap-3 p-5'>

      <h2 className='text-lg font-semibold text-color mb-3'>Vehicle Information</h2>

      <div className='flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm'>

        <PlateNumberInput
          vehicleNumber={userVehicle.vehicleNumber}
          disabled={trackRadioBox}
          handleChange={handleChange}
        />

        <VehicleTypeInput
          readOnly={trackRadioBox}
          value={userVehicle.vehicleType}
          handleChange={handleChange}
        />

      </div>

      <div className='flex items-center gap-x-1 mt-2'>

        <input
          type="checkbox"
          id='RegVehicle'
          name='useRegisteredVehicleCheckbox'
          onChange={handleRadioBox}
          className='cursor-pointer'
        />

        <label htmlFor="RegVehicle" className='text-sm text-color cursor-pointer'>
          Use your registered vehicle in your account
        </label>
        
      </div>

      <div className='flex flex-col items-center gap-2 w-full p-3'>

        <h2 className='text-xs text-color-3 text-center w-full max-w-md px-2'>
          <span className='text-color font-semibold'>NOTE:</span> Please ensure that the vehicle information you provide matches the vehicle you will use to park. Mismatched details may result in denial of access to the reserved slot.
        </h2>

        <p className='text-xs text-color-3 w-full max-w-md text-center px-2 py-3'>
          Refer to the <a href="/terms-and-condition" className='underline text-color-3 font-semibold hover:text-color'>terms and conditions</a> for more details.
        </p>

        <div className='flex items-center justify-center gap-x-3 mt-2'>
          <BackButton onClick={prevStep} />
          <NextButton onClick={handleNext} />
        </div>

      </div>

    </div>
    </>

  );
};

export default Step3;
