import React from 'react'
import NextButton from '../../buttons/nextbutton';
import CancelButton from '../../buttons/cancel';
import Loader from '../../loaders/loader';


const Step1 = ({slot, nextStep}) => {

  return (
    <>
    
     <div> 
        {slot ? (
            <div className='flex flex-col items-center gap-5 py-5 px-10'>

               <h2 className='font-bold text-lg text-color block md:hidden'>
                    Spot Information
                  </h2>

                <div className='flex flex-col items-baseline w-full max-w-xs gap-1 px-2'>

                    <label 
                    htmlFor="slotNumber"
                    className='font-semibold text-color text-sm md:text-md'>
                        Selected Slot Code
                    </label>

                    <input 
                    type="text"
                    id='SlotCode'
                    name='slotCode'
                    readOnly
                    value={slot.slotNumber}
                    className='w-full outline-0 border p-2 border-color-2 rounded-md text-xs sm:text-sm md:text-md text-color-2 cursor-default font-semibold' 
                    />
                                        
                </div>

                 <div className='flex flex-col items-baseline w-full max-w-xs gap-1 px-2'>

                    <label 
                    htmlFor="slotNumber"
                    className='font-semibold text-color text-sm md:text-md'>
                        Slot Price (₱)
                    </label>

                    <input 
                    type="text"
                    id='slotNumber'
                    readOnly
                    value={slot.slotPrice}
                    className='w-full outline-0 border p-2 border-color-2 rounded-md text-xs sm:text-sm md:text-md text-color-2 cursor-default font-semibold' 
                    />
                                        
                </div>

                <div className='flex flex-col items-baseline w-full max-w-xs gap-1 px-2'>

                <label 
                    htmlFor="slotType"
                    className='font-semibold text-color text-sm md:text-md'>
                    Parking Slot Type
                </label>

                <input 
                    type="text"
                    id='slotType'
                    readOnly
                    value= {slot.slotType}
                    className='w-full outline-0 border p-2 border-color-2 rounded-md text-xs sm:text-sm md:text-md text-color-2 cursor-default font-semibold' 
                />
                                        
               </div>

                <div className='flex items-center justify-center gap-x-2 '>
                  <CancelButton />
                  <NextButton onClick={nextStep} />
                </div>
                                    
              </div>) : 
                (
                   <Loader />
                )}
        </div>
    </>
  )
}

export default Step1;
