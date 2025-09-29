import React from 'react'

const VehicleTypeInput = ({ readOnly, value, handleChange }) => (

  <div className='flex flex-col items-baseline w-full max-w-xs gap-1'>

    <label htmlFor="vehicleType" className='font-semibold text-color text-sm md:text-md'>Vehicle Type</label>

    {readOnly ? (
      <input
        type="text"
        id="vehicleType"
        name="vehicleType"
        value={value || ''}
        readOnly
        className='w-full outline-0 border p-2 border-color-2 rounded-md text-xs md:text-sm text-color-2 cursor-default'
      />
    ) : (
      <select
        name="vehicleType"
        id="vehicleType"
        value={value}
        onChange={handleChange}
        className='w-full outline-0 border p-2 border-color-2 rounded-md text-sm text-color-2'>
            
        <option value="">Select vehicle type</option>
        <option value="2-Wheels (399cc below)">Small Motorcycle</option>
        <option value="2-Wheels (400cc up)">Bigbike Motorcycle</option>
        <option value="Sedan">Sedan</option>
        <option value="Hatchback">Hatchback</option>
        <option value="SUV">SUV</option>
        <option value="Pickup">Pickup</option>
        <option value="MPV">MPV</option>
        <option value="Van">Van</option>

      </select>

    )}
    
  </div>
);


export default VehicleTypeInput;
