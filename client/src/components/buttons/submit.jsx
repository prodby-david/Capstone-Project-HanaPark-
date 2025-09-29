import React from 'react'
import { CheckIcon } from '@heroicons/react/24/outline';

const Submit = ({onClick}) => {
  return (
    <>
        <div>
            <button onClick={onClick} className='flex items-center justify-center text-color-3 border w-[100px] text-sm p-2 rounded cursor-pointer transition ease-in-out hover:bg-gray-100 duration-300'>
                <CheckIcon className='w-5 h-5'/> Submit
            </button>
        </div>
    
    </>
  )
}

export default Submit;
