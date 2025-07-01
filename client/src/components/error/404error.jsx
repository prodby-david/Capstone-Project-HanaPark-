import React from 'react'

const ErrorNotFound = () => {
  return (
    <>  
        
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div>
                <h1 className='text-4xl font-bold text-center text-color'>404 - Page Not Found</h1>
                <p className='text-center text-lg mt-4 text-color-2'>The page you are looking for does not exist.</p>
                <div className='flex justify-center mt-10'>
                <a href="/dashboard" className='text-blue-500 hover:underline'>Go back to Home</a>
            </div>

            </div>
            
        </div>
    
    </>
  )
}

export default ErrorNotFound;
