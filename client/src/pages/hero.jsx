import React from 'react'
import { Link } from 'react-router-dom';
import Footer from '../components/footers/footer';
import Header from '../components/headers/header';
import { motion } from 'framer-motion';
import { container, fadeLeft } from '../lib/motionConfigs';

const Hero = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden gap-5">

        <Header />

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center items-center flex-grow px-5 text-center"
        >
          <motion.h2
            variants={fadeLeft}
            className="text-[32px] lg:text-[48px] text-color font-bold leading-tight"
          >
            Effortless Parking,
          </motion.h2>

          <motion.h2 
            variants={fadeLeft}
            className="text-[32px] lg:text-[48px] font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent leading-tight mb-2"
          >
            Right Where You Need It
          </motion.h2>

          <p className="max-w-[480px] text-center text-color-2 text-sm mb-6">
            Smart Parking Management designed for convenience, efficiency, and peace of mind.
          </p>

          <div className="flex gap-x-5">
            <Link
              to="/sign-in"
              className="text-sm p-3 bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-md w-[90px] text-center hover:from-blue-800 hover:to-blue-500 transition-transform duration-300 hover:scale-105 shadow-md shadow-color-3"
            >
              Sign in
            </Link>

            <a
              href="/visitors"
              className="text-sm p-3 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-md w-[90px] text-center hover:from-blue-500 hover:to-blue-800 transition-transform duration-300 hover:scale-105 shadow-md shadow-color-3"
            >
              Visitors
            </a>
          </div>
        </motion.div>
        
        <Footer />
      </div>
    </>
  );
}

export default Hero;
