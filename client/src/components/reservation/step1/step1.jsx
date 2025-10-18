import React from 'react';
import NextButton from '../../buttons/nextbutton';
import CancelButton from '../../buttons/cancel';
import Loader from '../../loaders/loader';

const Step1 = ({ slot, nextStep }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {slot ? (
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            
            <h2 className="font-bold text-xl text-color text-center">
              Spot Information
            </h2>

            <div className="flex flex-col w-full gap-2">
              <label
                htmlFor="slotCode"
                className="font-semibold text-color text-sm"
              >
                Selected Slot Code
              </label>
              <input
                type="text"
                id="slotCode"
                name="slotCode"
                readOnly
                value={slot.slotNumber}
                className="w-full outline-none border p-2 border-color-2 rounded-md text-sm text-color-2 cursor-default font-semibold bg-gray-50"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label
                htmlFor="slotPrice"
                className="font-semibold text-color text-sm"
              >
                Slot Price (₱)
              </label>
              <input
                type="text"
                id="slotPrice"
                readOnly
                value={slot.slotPrice}
                className="w-full outline-none border p-2 border-color-2 rounded-md text-smtext-color-2 cursor-default font-semibold bg-gray-50"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label
                htmlFor="slotType"
                className="font-semibold text-color text-sm"
              >
                Parking Slot Type
              </label>
              <input
                type="text"
                id="slotType"
                readOnly
                value={slot.slotType}
                className="w-full outline-none border p-2 border-color-2 rounded-md text-sm text-color-2 cursor-default font-semibold bg-gray-50"
              />
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <CancelButton />
              <NextButton onClick={nextStep} />
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default Step1;
