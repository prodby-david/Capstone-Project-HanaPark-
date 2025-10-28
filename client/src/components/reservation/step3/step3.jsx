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

    if (!vehicleNumber || !vehicleType) {
      toast.error('Please fill in all vehicle information fields.', toastOptions);
      return;
    }

    if (!plateNumberRegex.test(vehicleNumber)) {
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

    nextStep();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-6">

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-color mb-1">
            Vehicle Information
          </h2>
          <p className="text-sm text-color-2">
            Please provide accurate vehicle details before proceeding.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-lg">
          <PlateNumberInput
            vehicleNumber={userVehicle.vehicleNumber}
            disabled={trackRadioBox}
            handleChange={handleChange}
          />
          <VehicleTypeInput
            readOnly={trackRadioBox}
            value={userVehicle.vehicleType}
            handleChange={handleChange}
            slotType={slot?.slotType}
          />
        </div>

        <div className="flex items-center gap-x-2 mt-2">
          <input
            type="checkbox"
            id="RegVehicle"
            name="useRegisteredVehicleCheckbox"
            onChange={handleRadioBox}
            className="cursor-pointer accent-color"
          />
          <label
            htmlFor="RegVehicle"
            className="text-sm text-color cursor-pointer select-none"
          >
            Use registered vehicle from your account
          </label>
        </div>

        <div className="bg-blue-50 border-l-4 border-color-2 p-4 rounded-md mt-2 w-full">
            <p className="text-sm text-color-3 leading-relaxed">
              <span className="text-color font-semibold">NOTE:</span> Ensure that the vehicle
              information matches the actual vehicle you’ll use. Incorrect details may cause
              access issues at the parking gate.
            </p>

          <p className="text-xs text-center text-color-3 mt-3">
            Refer to our{" "}
            <a
              href="/terms"
              className="underline text-color-3 font-semibold hover:text-color transition-colors"
              target='blank'
            >
              Terms and Privacy
            </a>{" "}
            for more information.
          </p>
        </div>

        <div className="flex items-center justify-center gap-x-5 mt-3">
          <BackButton onClick={prevStep} />
          <NextButton onClick={handleNext} />
        </div>
      </div>
    </>
  );
};

export default Step3;
