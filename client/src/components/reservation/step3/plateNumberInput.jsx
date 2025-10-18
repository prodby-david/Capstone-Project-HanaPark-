import React from 'react';

const PlateNumberInput = ({ vehicleNumber, disabled, handleChange }) => (
  <div className="flex flex-col w-full max-w-xs gap-2">
    <label
      htmlFor="vehicleNumber"
      className="font-semibold text-color text-sm"
    >
      Plate Number or MV File
    </label>

    <input
      type="text"
      id="vehicleNumber"
      name="vehicleNumber"
      value={vehicleNumber}
      disabled={disabled}
      onChange={handleChange}
      placeholder="e.g. ABC123 or 123ABC"
      className={`w-full outline-none border p-2 rounded-md text-sm text-color-2 transition-all duration-200
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'border-color-2'}
      `}
    />
  </div>
);

export default PlateNumberInput;
