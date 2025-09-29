import React from 'react'
import NextButton from '../../buttons/nextbutton';
import BackButton from '../../buttons/backbutton';
import CancelButton from '../../buttons/cancel';
import { toast } from 'react-toastify';
import toastOptions from '../../../lib/toastConfig';

const Step2 = ({date, reservationTime, arrivalTime, setArrivalTime, nextStep, prevStep}) => {

  const handleNext = () => {
    if (!arrivalTime) {
      toast.error('Arrival Time is required.', toastOptions);
      return;
    }
    nextStep();
  }

  return (
    <>

    <div className="flex flex-col justify-center items-center p-10">

      <h2 className='font-bold text-color text-lg block md:hidden'>Date and Time</h2>
        
      <div className="flex flex-col gap-x-3 items-center mb-3 px-2">

        <div className="flex flex-col gap-y-2 mt-3">
            
          <label htmlFor="date" className="font-semibold text-color text-sm md:text-md">
            Reservation Date
          </label>
          
          <input
            type="text"
            name="date"
            value={date}
            readOnly
            id="date"
            className="border p-2 rounded-md w-full text-center font-semibold text-sm md:text-md"
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-x-3'>

          <div className="flex flex-col gap-y-2 mt-3">
            
          <label htmlFor="ReservationTime" className="font-semibold text-color text-sm md:text-md">Reservation Time</label>
          
          <input
            type="text"
            name="reservationTime"
            value={reservationTime}
            readOnly
            id="ReservationTime"
            className="border p-2 rounded-md w-full max-w-sm text-center font-semibold text-sm md:text-md"
          />
          
        </div>

          <div className="flex flex-col gap-y-2 mt-3">

            <label htmlFor="ArrivalTime" className="font-semibold text-color text-sm md:text-md">Arrival Time
            </label>

            <input
              type="time"
              name="arrivalTime"
              id="ArrivalTime"
              min='05:00'
              max='21:00'
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="border p-2 rounded-md w-full max-w-sm cursor-pointer text-sm md:text-md font-semibold"
            />

        </div>

        

        </div>

      </div>

      <div>
        <h2 className="text-xs text-color-3 w-full max-w-sm">
          <span className="text-color font-semibold">NOTE:</span> You must arrive at the parking area within 20 minutes of your reserved time. Failure to do so may result in the cancellation of your reservation.
        </h2>
      </div>

      <div className="flex gap-2 items-center justify-center mt-3">
        <BackButton onClick={prevStep} />
        <NextButton onClick={handleNext} />
      </div>

    </div>
    </>
  )
}

export default Step2;
