import React from 'react'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import toastOptions from '../../../lib/toastConfig'


const Step5 = ({reservationResult, navigate}) => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reservationResult.reservationCode)
      toast.success('Reservation code copied!', toastOptions);
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <>
        <div className="flex flex-col">

            <h2 className="text-md md:text-xl font-semibold text-color-3 mb-2 text-center">Reservation Confirmed!</h2>

            <p className='px-5 text-xs sm:text-sm text-color-2 text-center'>You must show this on your entrance and exit on the parking area.</p>

             <img src={reservationResult.qrCode} alt="QR Code" className="mx-auto w-[200px]" />

             <p className="mb-2 text-color-2 text-sm md: text-md text-center">
              Your reservation code: <span className='font-semibold text-color-3'>{reservationResult.reservationCode}</span>
             </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-3">

                <div className='flex items-center'>
                  <button 
                    type='button'
                    onClick={handleCopy}
                    className="flex gap-x-2 text-sm border border-color-3 text-color-3 px-4 py-2 rounded cursor-pointer transition ease-in-out hover:shadow-sm hover:shadow-color duration-300">
                    Copy Code <ClipboardDocumentListIcon className='w-5 h-5' />
                  </button>
                </div>

                <button 
                type='button'
                onClick={() => navigate('/recents')} 
                className="text-sm bg-color-3 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
                  Go to Recents
                </button>

              </div>

          </div>
    </>
  )
}

export default Step5
