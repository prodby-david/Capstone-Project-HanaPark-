import React from 'react'
import { TrashIcon } from '@heroicons/react/24/outline';

const DeleteButton = () => {
  return (
    <button 
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
       >
            <TrashIcon className='w-5 h-5' title='Delete user'/>
    </button>
  )
}

export default DeleteButton;
