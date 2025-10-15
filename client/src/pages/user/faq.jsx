import React from 'react'
import Header from '../../components/headers/header'

const FAQ = () => {
  return (
    <>

    <Header />

        <div className='flex flex-col items-center mt-10 gap-5 px-10'>

            <h2 className='font-semibold text-md text-color lg:text-xl'>Frequently Asked Questions</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-5 mt-5'>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>What is HanaPark?</h2>
                <p className='text-xs sm:text-sm md:text-md'>HanaPark is a smart parking web application exclusively for STI College Global City. It allows students and staff to find, reserve, and manage parking slots in real time.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>Who can use HanaPark?</h2>
                <p className='text-xs sm:text-sm md:text-md'>HanaPark is available only to registered students and staff of STI College Global City. Each user must have an active STI account to log in and access the platform.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>Can I view my reservation history?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Yes. You can view all your past and current reservations, including their status in your Recent Activities tab.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>Can I access HanaPark on my phone?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Yes, HanaPark is mobile-friendly and can be accessed through any modern web browser on your smartphone.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>What happen if I cancel after my reservation is approved?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Cancelling after admin confirmation will automatically mark your account with a violation tag. Repeated violations may lead to temporary suspension from the system.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>What if I forget my password?</h2>
                <p className='text-xs sm:text-sm md:text-md'>You can use the Forgot Password option in the sign in form to receive a reset link through your registered email</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>Is my personal information safe in HanaPark?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Yes. HanaPark implements data protection practices to ensure your account details and reservation history remain confidential.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>How many violations before getting suspended?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Typically, three violations result in temporary suspension. However, this policy may vary based on administrative discretion.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>How do I reserve a parking slot?</h2>
                <p className='text-xs sm:text-sm md:text-md'>Simply log in, view available slots in real-time, and click the Reserve button for your preferred slot. You’ll receive confirmation once it’s successfully reserved.</p>
              </div>

              <div className='text-center'>
                <h2 className='font-semibold text-md text-color-3 lg:text-lg'>What if I encounter a technical issue?</h2>
                <p className='text-xs sm:text-sm md:text-md'>You can contact the campus IT department or send a report through the Help or Contact Us section within HanaPark.</p>
              </div>

            </div>
            
        </div>

    </>
  )
}

export default FAQ
