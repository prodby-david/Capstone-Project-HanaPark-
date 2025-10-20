import React from 'react'
import NextButton from '../../buttons/nextbutton'
import BackButton from '../../buttons/backbutton'
import { toast } from 'react-toastify'
import toastOptions from '../../../lib/toastConfig'

const Step2 = ({ date, reservationTime, arrivalTime, setArrivalTime, nextStep, prevStep }) => {

   const handleNext = () => {

    if (!arrivalTime) {
      toast.error('Arrival Time is required.', toastOptions)
      return
    }

    const [hours, minutes] = arrivalTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    const minTime = 5 * 60   
    const maxTime = 21 * 60 

    if (totalMinutes < minTime || totalMinutes > maxTime) {
      toast.error('Arrival time must be between 5:00 AM and 9:00 PM.', toastOptions)
      return
    }

    nextStep()
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
        
        <h2 className="font-bold text-color text-xl mb-4 text-center md:hidden">
          Date & Time Details
        </h2>

        <div className="flex flex-col items-center gap-5 w-full">

          <div className="w-full">
            <label htmlFor="date" className="font-semibold text-color text-sm md:text-md mb-1 block">
              Reservation Date
            </label>
            <input
              type="text"
              name="date"
              id="date"
              value={date}
              readOnly
              className="w-full border border-color-2 p-2 rounded-lg text-center font-semibold text-color-2 bg-gray-50 text-sm md:text-md outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full justify-between gap-5">
            
            <div className="flex-1">
              <label htmlFor="ReservationTime" className="font-semibold text-color text-sm md:text-md mb-1 block">
                Reservation Time
              </label>
              <input
                type="text"
                name="reservationTime"
                id="ReservationTime"
                value={reservationTime}
                readOnly
                className="w-full border border-color-2 p-2 rounded-lg text-center font-semibold text-color-2 bg-gray-50 text-sm md:text-md outline-none"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="ArrivalTime" className="font-semibold text-color text-sm md:text-md mb-1 block">
                Arrival Time
              </label>
              <input
                type="time"
                name="arrivalTime"
                id="ArrivalTime"
                min="05:00"
                max="21:00"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full border border-color-2 p-2 rounded-lg text-center font-semibold text-color bg-white text-sm md:text-md cursor-pointer outline-none"
              />
            </div>

          </div>

          <div className="bg-blue-50 border-l-4 border-color-2 p-4 rounded-md mt-2 w-full">
            <h2 className="text-xs sm:text-sm text-color-3 leading-relaxed">
              <span className="text-color font-semibold">NOTE:</span> You must arrive at the parking area within <span className="font-semibold text-color">60 minutes</span> of your reserved time. Failure to do so may result in automatic cancellation.
            </h2>
          </div>

          <div className="flex gap-2 items-center justify-center mt-4">
            <BackButton onClick={prevStep} />
            <NextButton onClick={handleNext} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Step2
