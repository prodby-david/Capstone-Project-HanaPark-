import React, { useState, useEffect } from 'react'
import NextButton from '../../buttons/nextbutton'
import BackButton from '../../buttons/backbutton'

const Step2 = ({ date, initialTime, nextStep, prevStep }) => {
  const [reservationTime, setReservationTime] = useState(initialTime || '')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [minTime, setMinTime] = useState('05:00')
  const maxTime = '21:00'

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const minReservationDate = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000)
    let hh = minReservationDate.getHours().toString().padStart(2, '0')
    let mm = minReservationDate.getMinutes().toString().padStart(2, '0')
    let calculatedMin = `${hh}:${mm}`

    if (calculatedMin < '05:00') calculatedMin = '05:00'
    if (calculatedMin > maxTime) calculatedMin = maxTime

    setMinTime(calculatedMin)
    // Remove automatic overwrite to allow manual selection
    // if (!reservationTime || reservationTime < calculatedMin) {
    //   setReservationTime(calculatedMin)
    // }
  }, [currentTime])

  const handleNext = () => {
    if (!reservationTime) {
      alert('Please select a reservation time before continuing.')
      return
    }

    // Validation: must be 2 hours ahead
    const [hh, mm] = reservationTime.split(':').map(Number)
    const selectedDate = new Date()
    selectedDate.setHours(hh, mm, 0, 0)

    const twoHoursAhead = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000)

    if (selectedDate < twoHoursAhead) {
      alert('Reservation time must be at least 2 hours from now.')
      return
    }

    if (reservationTime < '05:00' || reservationTime > '21:00') {
      alert('Reservation time must be between 5:00 AM and 9:00 PM.')
      return
    }

    nextStep({ reservationTime }) // send time to parent
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
      <h2 className="font-bold text-color text-xl mb-4 text-center">
        Date & Time
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

        <div className="w-full">
          <p className="text-sm text-color-3 mb-1">Current Time: {currentTime.toLocaleTimeString()}</p>
          <label htmlFor="reservationTime" className="font-semibold text-color text-sm md:text-md mb-1 block">
            Reservation Time
          </label>
          <input
            type="time"
            name="reservationTime"
            id="reservationTime"
            value={reservationTime}
            min={minTime}
            max={maxTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full border border-color-2 p-2 rounded-lg text-center font-semibold text-color-2 bg-gray-50 text-sm md:text-md outline-none"
          />
        </div>

        <div className="bg-blue-50 border-l-4 border-color-2 p-4 rounded-md mt-2 w-full">
          <h2 className="text-xs sm:text-sm text-color-3 leading-relaxed">
            <span className="text-color font-semibold">NOTE:</span> Reservation time must be at least
            <span className="font-semibold text-color"> 2 hours from now</span> and between
            <span className="font-semibold text-color"> 5:00 AM and 9:00 PM</span>. You must arrive
            <span className="font-semibold text-color"> on or before your reserved time</span>.
            Reservations not validated on time will be
            <span className="font-semibold text-color"> automatically cancelled</span>.
          </h2>
        </div>

        <div className="flex gap-2 items-center justify-center mt-4">
          <BackButton onClick={prevStep} />
          <NextButton onClick={handleNext} />
        </div>
      </div>
    </div>
  )
}

export default Step2
