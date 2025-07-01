import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <div className='flex items-center justify-around py-5'>
        <Link to="/" className='font-bold lg:text-lg text-color'>HanaPark</Link>
        <p className='text-xs text-color-3 font-semibold'>Smart Parking Made Easy</p>
    </div>
  )
}

export default Header;
