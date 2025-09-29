import React from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";

const Loader = ({text = 'Loading...', color = '#00509e', size = 15 }) => {
  return (
   <>
   <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <h2 className="mb-4 text-lg font-medium text-gray-700">{text}</h2>
      <PropagateLoader color={color} size={size} />
   </div>

   </>
  )
}

export default Loader;
