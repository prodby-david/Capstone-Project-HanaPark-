import React from 'react'
import BackButton from '../../buttons/backbutton';
import Submit from '../../buttons/submit';

const Step4 = ({ 
  slotCode, 
  slotPrice, 
  slotType, 
  reservationDate, 
  reservationTime, 
  plateNumber, 
  vehicleType, 
  prevStep, 
  submit 
}) => {
  return (
    <>
      <div className="flex flex-col gap-y-6 p-6 md:p-10 ">

        <div className="text-center">
          <h2 className="text-2xl font-bold text-color mb-1">Reservation Summary</h2>
          <p className="text-sm text-color-2">
            Please review all the details carefully before proceeding to parking area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-color">Spot Information</h3>

            <div className="space-y-1 text-sm">
              <p><span className="text-color-2 font-medium">Slot Code:</span> {slotCode}</p>
              <p><span className="text-color-2 font-medium">Slot Price (₱):</span> {slotPrice}</p>
              <p><span className="text-color-2 font-medium">Type:</span> {slotType}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-color">Date & Time</h3>

            <div className="space-y-1 text-sm">
              <p><span className="text-color-2 font-medium">Reservation Date:</span> {reservationDate}</p>
              <p><span className="text-color-2 font-medium">Reservation Time:</span> {reservationTime}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-color">Vehicle Information</h3>

            <div className="space-y-1 text-sm">
              <p><span className="text-color-2 font-medium">Plate Number:</span> {plateNumber}</p>
              <p><span className="text-color-2 font-medium">Vehicle Type:</span> {vehicleType}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-x-6 mt-4">
          <BackButton onClick={prevStep} />
          <Submit onClick={submit} />
        </div>
      </div>
    </>
  )
}

export default Step4;
