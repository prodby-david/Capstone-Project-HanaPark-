import React from 'react'

const PlateNumberInput = ({ vehicleNumber, disabled, handleChange }) => (

  <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

    <label htmlFor="vehicleNumber" className="font-semibold text-color text-sm md:text-md">
      Plate Number or MV File
    </label>

    <input
      type="text"
      id="vehicleNumber"
      name="vehicleNumber"
      value={vehicleNumber}
      disabled={disabled}
      onChange={handleChange}
      className='w-full max-w-sm outline-0 border p-2 border-color-2 rounded-md text-xs md:text-sm text-color-2'
    />
    
  </div>
);


export default PlateNumberInput;
