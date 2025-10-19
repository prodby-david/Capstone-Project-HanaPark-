import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'  
import toastOptions from '../../../lib/toastConfig'
import Loader from '../../loaders/loader'
import AdminAPI from '../../../lib/inteceptors/adminInterceptor'; 
import AdminHeader from '../../headers/adminHeader'



const CreateSlot = () => {

  const [slotData, setSlotData] = useState({
    slotUser: '',
    slotNumber: '',
    slotType: '',
    slotPrice: '',
    slotStatus: '',
    slotDescription: ''
  });

  const [existingSlots, setExistingSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_SLOTS = {
  Student: 40,
  Staff: 30,
  Visitor: 20
  };

  const handleChange = async (e) => {

    const {name, value } = e.target;

      if (name === 'slotType') {
      let newPrice = '';
      if (value === '2-Wheels (399cc below)') {
        newPrice = 50;
      } else if (value === '2-Wheels (400cc up)' || value === '4-Wheels') {
        newPrice = 80;
      }
      setSlotData(prev => ({
        ...prev,
        slotType: value,
        slotPrice: newPrice, 
      }));
      return; 
    }

    setSlotData({...slotData, [name]: value});

    if (name === 'slotUser') {
      
      try {
        const res = await AdminAPI.get(`/admin/slots?user=${value}`);

        const slots = res.data;
        setExistingSlots(slots);

        if (slots.length >= MAX_SLOTS[value]) {
          setSlotData(prev => ({ ...prev, slotNumber: '' }));
        } else {
          const prefix = value === 'Student' ? 'STU' : value === 'Staff' ? 'STA' : 'VIS';

        const numbers = slots.map(s => parseInt(s.slotNumber.split('-')[1])).filter(n => !isNaN(n)); 

        const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
        const nextSlotNumber = `${prefix}-${maxNum + 1}`;

          setSlotData(prev => ({
            ...prev,
            slotNumber: nextSlotNumber
          }));
        }
      } catch (err) {
        console.error('Error fetching slots', err);
      }
    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( !slotData.slotUser ||
        !slotData.slotNumber ||
        !slotData.slotType ||
        !slotData.slotStatus
      ){
        toast.error('Fields should not be empty.', toastOptions);
        return;
      }

      setIsLoading(true);

    try{

      const res = await AdminAPI.post('/admin/slots', slotData);

      if(res.data.success){

          Swal.fire({
            title: 'New slot added',
            text: 'Slot created successfully.',
            icon: 'success',
            confirmButtonColor: '#00509e',
            confirmButtonText: 'Confirm'
          });

          setSlotData({
            slotUser: '',
            slotNumber: '',
            slotType: '',
            slotPrice: '',
            slotStatus: '',
            slotDescription: ''
          });
      }
      
    }catch(err){
        Swal.fire({
          title: 'Creating slot failed',
          text: err.response.data.message,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
    }
    finally{
      setIsLoading(false)
    }
  }


 return (
  <>
    <AdminHeader />
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#C8A8E9] to-[#9460C9] px-5">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-2xl font-semibold text-color text-center mb-6">
          Create Parking Slot
        </h2>

        <form className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="SlotUser"
                className="text-sm font-semibold text-color-3 mb-1"
              >
                Slot User
              </label>
              <select
                name="slotUser"
                id="SlotUser"
                value={slotData.slotUser}
                onChange={handleChange}
                className="p-2 rounded-lg bg-white/20 text-color-2 outline-none focus:ring-2 focus:ring-[#9460C9] transition-all text-sm"
              >
                <option value="" disabled>
                  Select Slot User
                </option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="SlotNumber"
                className="text-sm font-semibold text-color-3 mb-1"
              >
                Slot Number
              </label>
              <input
                type="text"
                name="slotNumber"
                id="SlotNumber"
                value={slotData.slotNumber}
                onChange={handleChange}
                readOnly
                disabled
                placeholder="Slot Number"
                className="p-2 rounded-lg bg-white/20 text-color-2 outline-none cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="SlotType"
                className="text-sm font-semibold text-color-3 mb-1"
              >
                Slot Type
              </label>
              <select
                name="slotType"
                id="SlotType"
                value={slotData.slotType}
                onChange={handleChange}
                className="p-2 rounded-lg bg-white/20 text-color-2 outline-none focus:ring-2 focus:ring-[#9460C9] transition-all text-sm"
              >
                <option value="" disabled>
                  Select Slot Type
                </option>
                <option value="2-Wheels (399cc below)">
                  2-Wheels (399cc below)
                </option>
                <option value="2-Wheels (400cc up)">2-Wheels (400cc up)</option>
                <option value="4-Wheels">4-Wheels</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="SlotPrice"
                className="text-sm font-semibold text-color-3 mb-1"
              >
                Price
              </label>
              <input
                type="text"
                id="SlotPrice"
                value={`₱ ${slotData.slotPrice}`}
                onChange={handleChange}
                readOnly
                className="p-2 rounded-lg bg-white/20 text-color-2 outline-none cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="SlotStatus"
              className="text-sm font-semibold text-color-3 mb-1"
            >
              Status
            </label>
            <select
              name="slotStatus"
              id="SlotStatus"
              value={slotData.slotStatus}
              onChange={handleChange}
              className="p-2 rounded-lg bg-white/20 text-color-2 outline-none focus:ring-2 focus:ring-[#9460C9] transition-all text-sm"
            >
              <option value="" disabled>
                Slot Status
              </option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Occupied">Occupied</option>
              <option value="Ongoing Maintenance">Ongoing Maintenance</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="SlotDescription"
              className="text-sm font-semibold text-color-3 mb-1"
            >
              Slot Description
            </label>
            <textarea
              name="slotDescription"
              id="SlotDescription"
              value={slotData.slotDescription}
              onChange={handleChange}
              maxLength={100}
              placeholder="Description"
              className="p-3 rounded-lg bg-white/20 text-color-2 outline-none focus:ring-2 focus:ring-[#9460C9] transition-all text-sm resize-none h-32"
            ></textarea>
          </div>

          <p className="text-xs text-center text-color-2">
            <span className="font-semibold text-color-3">NOTE:</span> Max slots:
            Students: 40, Staff: 30, Visitors: 20.
          </p>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-3 bg-gradient-to-r from-[#9460C9] to-[#3366CC] text-white py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>

    {isLoading ? <Loader text="Creating slot..." /> : null}
  </>
);

}

export default CreateSlot;
