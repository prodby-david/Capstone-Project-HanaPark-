import React from 'react';
import ClockLoader from "react-spinners/ClockLoader";

const Loader = ({ text = 'Loading...', color = '#00509e', size = 35 }) => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-medium text-color-3">{text}</h2>
      <ClockLoader color={color} size={size} />
    </div>
  );
};

export default Loader;
