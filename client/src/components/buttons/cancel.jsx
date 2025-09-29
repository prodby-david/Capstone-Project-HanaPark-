import React from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CancelButton = () => {

    const navigate = useNavigate(); 

    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to resume this reservation!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/dashboard')
            }
        })
    }


  return (
    <>  
        <button 
        type='button' 
        className=' flex justify-center items-center gap-x-1 text-white bg-red-500 border w-[100px] p-2 rounded cursor-pointer transition ease-in-out hover:opacity-75 duration-300 text-sm'
        onClick={handleCancel}>
            <XMarkIcon  className='w-5 h-5'/> Cancel
        </button>
    </>
  )
}

export default CancelButton;
