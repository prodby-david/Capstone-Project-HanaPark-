import React from 'react'
import Header from '../components/headers/header';

const Visitors = () => {
  return (
    <>
        <Header />

        <div className='flex flex-col justify-center items-center gap-y-15 mt-15 px-5' >

            <div className='text-center'>
                <h2 className='text-[28px] lg:text-[44px] font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent'>Welcome, Guest!
                </h2>

                <p className='max-w-[600px] text-color-2 text-center'>
                    Easily check real-time parking availability, reserve a spot in advance, and ensure a hassle-free visit.
                </p>
            </div>

            <div>
                <h2 className='text-color-3 font-bold text-[20px]'>Available Guest Parking Slot</h2>
            </div>

           
            
        </div>

    </>
  )
}

export default Visitors;
