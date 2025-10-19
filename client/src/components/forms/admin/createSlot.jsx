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
      <div className='flex justify-center items-center mt-3 px-5'>

        <div className='flex flex-col text-center p-5 shadow-md shadow-color-2 w-full max-w-md'>

          <h2 className='text-lg text-color font-semibold'>Create Parking Slot</h2>

          <form className='flex flex-col gap-3 mt-5'>

            <div className='flex gap-x-3 w-full'>

              <div className='flex flex-col items-baseline w-full'>
                 <label 
                 htmlFor="SlotUser"
                 className='text-color-3 font-semibold text-sm'
                 >
                  Slot User
                </label>
                
                <select 
                name="slotUser" 
                id="SlotUser" 
                value={slotData.slotUser} 
                onChange={handleChange}
                className='outline-0 border hover:cursor-pointer focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
                >

                  <option value="" disabled>Select Slot User</option>
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                  <option value="Visitor">Visitor</option>

            </select>

          </div>
             
              <div className='flex flex-col items-baseline w-full'>

                <label 
                htmlFor="SlotNumber" 
                className='text-color-3 font-semibold text-sm'
                >
                  Slot Number
                </label>

                 <input 
                  type="text"
                  name='slotNumber'
                  id='SlotNumber'
                  value={slotData.slotNumber}
                  onChange={handleChange}
                  readOnly
                  disabled={true}
                  placeholder='Slot Number'
                  className='border p-2 rounded-md text-sm text-color-2 w-full'
                  />

              </div>
             

            </div>

              <div className='flex gap-3 items-center justify-center '>

                <div className='flex flex-col items-baseline w-full'>
                  <label 
                  htmlFor="SlotType" 
                  className='text-color-3 font-semibold text-sm'
                  >
                    Slot Type
                  </label>
                  
                  <select 
                    name="slotType" 
                    id="SlotType"
                    value={slotData.slotType}
                    onChange={handleChange}
                    className=' outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
                    >
                      <option value="" disabled>Select Slot Type</option>
                      <option value="2-Wheels (399cc below)">2-Wheels (399cc below)</option>
                      <option value="2-Wheels (400cc up)">2-Wheels (400cc up)</option>
                      <option value="4-Wheels">4-Wheels</option>
                  </select>

                </div>

                <div className='flex flex-col items-baseline w-full'>
                  <label 
                  htmlFor="SlotPrice"
                  className='text-color-3 font-semibold text-sm'
                  >
                    Price
                  </label>
                    <input 
                      type="text"
                      id='SlotPrice'
                      value={`₱ ${slotData.slotPrice}`}
                      onChange={handleChange}
                      readOnly
                      className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full'
                    />
                </div>
              
              </div>
              
              <div className='flex flex-col items-baseline w-full'>
                <label 
                htmlFor="SlotStatus" 
                className='text-color-3 font-semibold text-sm'
                >
                  Status
                </label>
                
                <select 
                name="slotStatus" 
                id="SlotStatus"
                value={slotData.slotStatus}
                onChange={handleChange}
                className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full' >
                  <option value="" disabled>Slot Status</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Ongoing Maintenance">Ongoing Maintenance</option>
              </select>

              </div>
            

            <div className='flex flex-col items-baseline w-full'>
              <label 
                htmlFor="SlotDescription" 
                className='text-color-3 font-semibold text-sm'
                >
                  Slot Description
                </label>
              <textarea 
              name="slotDescription" 
              id="SlotDescription" 
              value={slotData.slotDescription}
              onChange={handleChange}
              maxLength={100}
              placeholder='Description' 
              className='outline-0 border focus:border-color-3 p-2 rounded-md text-sm text-color-2 w-full h-[150px] resize-none'>
              </textarea>
            </div>

            <div>
              <p className='text-xs text-color-2'><span className='font-semibold text-color-3'>NOTE: </span>Max slots: Students: 40, Staff: 30 and Visitors: 20.</p>
            </div>

            <button 
              type='submit'
              onClick={handleSubmit}
              className='w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white p-2 rounded-md hover:from-blue-900 hover:to-blue-500 transition duration-300 cursor-pointer text-sm'>
              Submit
            </button>
           

          </form>

        </div>
        
      </div>

      {isLoading ? <Loader text='Creating slot...' /> : null}
    </>
  )
}

export default CreateSlot;
