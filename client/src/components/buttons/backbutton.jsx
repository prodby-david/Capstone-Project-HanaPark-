import React from 'react'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({onClick}) => {
  
  return (

    <div>
        <button
        onClick={onClick}
        className=" text-white bg-color-3 w-[100px] p-2 rounded border border-color-3 cursor-pointer shadow-sm transition ease-in-out hover:shadow-color-3 hover:opacity-95 duration-300 text-sm">

        <div className='flex items-center justify-center gap-x-2'>
          <ArrowUturnLeftIcon className='w-5 h-5' />
          <span className='text-md font-semibold'>Back</span>
        </div>
          
        </button>
    </div>
    
  )
}

export default BackButton;
