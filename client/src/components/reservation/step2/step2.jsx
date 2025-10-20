import React from 'react'
import NextButton from '../../buttons/nextbutton'
import BackButton from '../../buttons/backbutton'





const Step2 = ({ date, reservationTime, nextStep, prevStep }) => {
  const handleNext = () => {
    nextStep()
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
        <h2 className="font-bold text-color text-xl mb-4 text-center">
          Date & Time
        </h2>

        <div className="flex flex-col items-center gap-5 w-full">
          <div className="w-full">
            <label
              htmlFor="date"
              className="font-semibold text-color text-sm md:text-md mb-1 block"
            >
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
              <label
                htmlFor="ReservationTime"
                className="font-semibold text-color text-sm md:text-md mb-1 block"
              >
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
          </div>

          <div className="bg-blue-50 border-l-4 border-color-2 p-4 rounded-md mt-2 w-full">
           <h2 className="text-xs sm:text-sm text-color-3 leading-relaxed">
              <span className="text-color font-semibold">NOTE:</span> You must arrive 
              <span className="font-semibold text-color"> no later than 45 minutes before the reserved time</span>. 
              A <span className="font-semibold text-color">60-minute grace period</span> is provided for confirmation or parking. 
              Reservations not validated within this period will be 
              <span className="font-semibold text-color"> automatically cancelled</span>.
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
