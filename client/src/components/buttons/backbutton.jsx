import React from 'react'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({onClick}) => {
  
  return (

    <div>
        <button
        onClick={onClick}
        className=" text-color-3 text-sm border w-[100px] p-2 rounded cursor-pointer transition ease-in-out hover:bg-gray-100 duration-300" >

        <div className='flex items-center justify-center gap-x-2'>
          <ArrowUturnLeftIcon className='w-5 h-5' />
          <span className='text-md font-semibold'>Back</span>
        </div>
          
        </button>
    </div>
    
  )
}

export default BackButton;
