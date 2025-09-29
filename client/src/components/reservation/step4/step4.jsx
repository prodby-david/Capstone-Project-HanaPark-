import React from 'react'
import BackButton from '../../buttons/backbutton';
import Submit from '../../buttons/submit';

const Step4 = ({ slotCode, slotPrice, slotType, reservationDate, 
  reservationTime, plateNumber, vehicleType, prevStep, submit }) => {

  return (
    <>
        
        <div className='flex flex-col gap-y-3 p-5'>

          <div>
            <h2 className='text-xl font-semibold text-color-3 mb-1'>Reservation Details</h2>
            <p className='text-sm text-color-2'>
              Please check all the information before proceeding to payment
            </p>
          </div>
          
          
          <div className='flex flex-col md:flex-row justify-center gap-3'>

            {/* Spot Information Container */}
            <div className='flex flex-col justify-center gap-2 p-5 shadow-sm rounded-md'>

              <h2 className='font-semibold text-color text-lg '>Spot Information</h2>

              <div className='flex flex-col gap-2 text-sm'>
                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Slot Code:</span>{slotCode}
                </p>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Slot Price (₱):  </span>{slotPrice}
                </p>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Type: </span>{slotType}
                </p>

              </div>
             
            </div>

            {/* Date and Time Container */}
            <div className='flex flex-col justify-center gap-2 p-5 shadow-sm rounded-md'>

              <h2 className='font-semibold text-color text-lg mb-5'>Date and Time</h2>

              <div className='flex flex-col gap-2 text-sm'>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Reservation Date: </span>{reservationDate}
                </p>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Reservation Time: </span>{reservationTime}
                </p>

              </div>
             
            </div>

            {/* Vehicle Information Container */}

            <div className='flex flex-col justify-center gap-2 p-5 shadow-sm rounded-md'>

              <h2 className='font-semibold text-color text-lg mb-5'>Vehicle Information</h2>
              
              <div className='flex flex-col gap-2 text-sm'>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Plate Number: </span>{plateNumber}
                </p>

                <p className='font-semibold text-color-3'>
                  <span className='text-color-2 font-semibold'>Vehicle Type: </span>{vehicleType}
                </p>

              </div>
              
            </div>

          </div>

            <div className='flex justify-center items-center gap-x-5 '>
              <BackButton onClick={prevStep}/>
              <Submit onClick={submit}/>
            </div>

        </div>

        
    </>
  )
}

export default Step4;
