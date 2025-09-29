import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../lib/socket';
import ShowMore from '../../components/buttons/showmore';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import Swal from 'sweetalert2';
import { ArrowPathIcon, EyeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import carimg from '../../assets/carimg.png'
import smallbikeimg from '../../assets/smallbikeimg.png'
import bigbikeimg from '../../assets/bigbikeimg.png'
import Loader from '../../components/loaders/loader';
import UserHeader from '../../components/headers/userHeader'
import { useAuth } from '../../context/authContext';




const Spots = () => {

    const [slots, setSlots] = useState([]);
    const navigate = useNavigate();
    const [randomSlot, setRandomSlot] = useState(null);
    const [visibleSlot, setVisibleSlot]= useState(9);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [selectedType, setSelectedType] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = useAuth();
    const user = auth.user; 


    const slotTypeOptions = [
      { label: 'All Types', value: 'All' },
      { label: '2-Wheels (399cc below)', value: '2-Wheels (399cc below)' },
      { label: '2-Wheels (400cc up)', value: '2-Wheels (400cc up)' },
      { label: '4-Wheels', value: '4-Wheels' },
    ];

    const handleReserve = (slotId) => {
      navigate(`/reservation-form/${slotId}`);
    };

      const handleShowAllSlots = () => {
        setRandomSlot(null);      
        setVisibleSlot(slots.length); 
      };


    const handleRandomSlot = () => {
      const available = slots.filter(slot => 
        slot.slotStatus === 'Available' && slot.slotUser === 'Student'
      );

      if (available.length === 0) {
        Swal.fire({
          title: 'No Available Slots',
          text: 'There are no available slots for students at the moment.',
          icon: 'info',
          confirmButtonColor: '#00509e',
          confirmButtonText: 'OK'
        })
        return;
      }

      const randomIndex = Math.floor(Math.random() * available.length);
      setRandomSlot(available[randomIndex]);
    }

    const getSlotImage = (type) => {
      switch (type) {
        case '2-Wheels (399cc below)':
          return smallbikeimg;
        case '2-Wheels (400cc up)':
          return bigbikeimg;
        case '4-Wheels':
          return carimg;
        default:
          return null;
      }
    };

    const handleSeeMore = useCallback(() => {
      setVisibleSlot(slots.length);
    }, [slots.length]);

   const displayedSlots = useMemo(() => {
    return slots.filter(slot => {
  
    if (!user) return false;

    const matchesRole = user.userType === 'Student' ? slot.slotUser === 'Student' : user.userType ===  'Staff'? slot.slotUser === 'Staff' : true; 

    const matchesType =
      selectedType === 'All' || slot.slotType === selectedType;

    const isAvailable =
      !showAvailableOnly || slot.slotStatus === 'Available';

    return matchesRole && matchesType && isAvailable;
  });
}, [slots, showAvailableOnly, selectedType, user?.userType]);


   useEffect(() => {
        const handleUpdated = (updatedSlot) => {
          setSlots((prevSlots) =>
            prevSlots.map((slot) =>
              slot._id === updatedSlot._id ? updatedSlot : slot
            )
          );
        };

        const handleCreated = (createdSlot) => {
          setSlots(prevSlots => [...prevSlots, createdSlot]);
        };

        socket.on('slotUpdated', handleUpdated);
        socket.on('slotCreated', handleCreated);

        return () => {
          socket.off('slotUpdated', handleUpdated);
          socket.off('slotCreated', handleCreated);
        };
    }, []);

   

    useEffect(() => {
        const fetchSlots = async () => {
          setIsLoading(true);
            try{
                const res = await UserAPI.get('/slots');
                setSlots(res.data);
            }catch(err){
                console.error('Error fetching slots:', err);
            }finally {
              setIsLoading(false);
            }
        }
        fetchSlots();
    }, []);


  return (
    <>
        <UserHeader />
    
   <div className='p-5'>

      <div className='flex flex-col sm:flex-row items-center justify-between p-5'>

        <h2 className='text-xl font-semibold mb-4 text-color'>Parking Slots</h2>

        <div className='flex justify-center items-center gap-x-2'>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setVisibleSlot(9); 
            }}
            className="shadow-sm border rounded p-2 "
          >
            {slotTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleRandomSlot}
            className="text-color-3 cursor-pointer hidden sm:block"
          >
            <ArrowPathIcon
            title='Select random slot' 
            className="w-5 h-5" />
          </button>

          {randomSlot && (
            <button
              onClick={handleShowAllSlots}
              className="text-color-3 rounded cursor-pointer text-md"
            >
              <ListBulletIcon
                title='Show all slots' 
                className="w-6 h-6 text-md text-color-3"/>
            </button>
          )}

          {!randomSlot && (
            <button
              onClick={() => {
                setShowAvailableOnly(prev => !prev);
                setVisibleSlot(9); 
              }}
              className="text-white rounded cursor-pointer text-sm hidden sm:block"
              >
                {
                showAvailableOnly ? <ListBulletIcon
                title='Show all slots' 
                className="w-6 h-6 text-md text-color-3"/> : 
                <EyeIcon 
                title='Show available slots only'
                className="w-6 h-6 text-md text-color-3"/>
                }
            </button>
          )}
           

        </div>
       
      </div>
      


      {isLoading ? (
        <Loader text='Loading slots...' />
        ): displayedSlots.length === 0 ? (
        <p>No slots available.</p>
      ) : (
        <motion.div
        variants={container}
        initial='hidden'
        animate='show' 
        className='flex flex-wrap flex-1 justify-center gap-5'>
          {(randomSlot ? [randomSlot] : displayedSlots.slice(0, visibleSlot)).map((slot) => (
              <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.1}} 
              key={slot._id} 
              className='flex flex-col items-center justify-center shadow-sm shadow-color rounded-md p-5 text-sm lg:text-base w-full max-w-sm'>
              
              <div className='p-3'>
                <div className='flex justify-center'>
                  <img src={getSlotImage(slot.slotType)} 
                  alt={slot.slotType} 
                  width={100}
                  />
                </div>
                <p className='text-color-2'><strong className='text-color-3'>Slot Number:</strong> {slot.slotNumber}</p>
                <p className='text-color-2'><strong className='text-color-3'>Type:</strong> {slot.slotType}</p>
                <p className='text-color-2'><strong className='text-color-3'>Price:</strong> {`₱ ${slot.slotPrice}`}</p>                
                 <p className='text-color-2'><strong className='text-color-3'>Status:</strong> <span className={
                slot.slotStatus === 'Available' ? 'text-green-600' :
                slot.slotStatus === 'Reserved' ? 'text-yellow-600' :
                slot.slotStatus === 'Occupied' ? 'text-red-600' :
                'text-blue-600'
                }>{slot.slotStatus}</span> </p>
              
              </div>
              <button
              onClick={() => handleReserve(slot._id)} 
              disabled={slot.slotStatus !== 'Available'} 
              className={`px-4 py-2 rounded transition ${slot.slotStatus === 'Available' ? 'bg-color-3 text-white cursor-pointer hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}
               text-sm lg:text-md`}>{slot.slotStatus === 'Available' ? 'Reserve Now' : 'Reserved'}
               </button>
              </motion.div>
              
            ))}
        </motion.div>
      )}
      {displayedSlots.length > visibleSlot && (
        <div className={`flex justify-center mt-5 ${randomSlot ? 'hidden' : ''}`}>
          <ShowMore onClick={handleSeeMore} />
        </div>
      )}
    </div>
    </>
  );
};
export default Spots;
