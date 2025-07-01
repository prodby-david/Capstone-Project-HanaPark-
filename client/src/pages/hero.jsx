import React from 'react'
import { Link } from 'react-router-dom';
import Footer from '../components/footers/footer';
import Header from '../components/headers/header';
import { motion } from 'framer-motion';
import { container, fadeLeft } from '../lib/motionConfigs';



const Hero = () => {


  return (
    <>

      <Header />

        <motion.div 
          variants={container}
          initial='hidden'
          animate='show'
          className='flex flex-col justify-center items-center min-h-90 px-5'
        >

        <motion.h2
          variants={fadeLeft}
          className='text-[32px] lg:text-[48px] leading-9 lg:leading-7 text-color font-bold'
        >
            Effortless Parking,
        </motion.h2>

        <motion.h2 
          variants={fadeLeft}
          className='text-[32px] lg:text-[48px] font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent text-center leading-9 lg:leading-18 mb-2'
        >
            Right Where You Need It
        </motion.h2>

        <p className='max-w-[480px] text-center text-color-2 text-sm'>
          Smart Parking Management Designed for convenience, efficiency, and peace of mind.
        </p>

        <div className='flex gap-x-5 mt-4'>

          <Link to='/sign-in' 
          className='text-sm p-3 bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-md w-[90px] text-center hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-500 transition ease-in-out hover:scale-105 duration-300'
          >
            Sign in
          </Link>

          <a href="/visitors" 
            className='text-sm p-3 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-md w-[90px] text-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-800 transition  ease-in-out hover:scale-105 duration-300'
          >
              Visitors
          </a>

        </div>

      </motion.div>
      
    <Footer />

    </>
  );
}

export default Hero;
