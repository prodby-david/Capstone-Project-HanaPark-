import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../lib/socket';
import ShowMore from '../../components/buttons/showmore';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import Swal from 'sweetalert2';
import {
  ArrowPathIcon,
  EyeIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import carimg from '../../assets/carimg.png';
import smallbikeimg from '../../assets/smallbikeimg.png';
import bigbikeimg from '../../assets/bigbikeimg.png';
import Loader from '../../components/loaders/loader';
import UserHeader from '../../components/headers/userHeader';
import { useAuth } from '../../context/authContext';
import BackButton from '../../components/buttons/backbutton';

const Spots = () => {
  const [slots, setSlots] = useState([]);
  const [randomSlots, setRandomSlots] = useState([]);
  const [visibleSlot, setVisibleSlot] = useState(9);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const slotTypeOptions = [
    { label: 'All Types', value: 'All' },
    { label: '2-Wheels (399cc below)', value: '2-Wheels (399cc below)' },
    { label: '2-Wheels (400cc up)', value: '2-Wheels (400cc up)' },
    { label: '4-Wheels', value: '4-Wheels' },
  ];

  const handleReserve = (slotId) => navigate(`/reservation-form/${slotId}`);

  const handleShowAllSlots = () => {
  setRandomSlots([]);
  setVisibleSlot(slots.length);
};


  const handleRandomSlot = () => {
  const available = slots.filter(
    (slot) => slot.slotStatus === 'Available' && slot.slotUser === 'Student'
  );

  if (available.length === 0) {
    Swal.fire({
      title: 'No Available Slots',
      text: 'There are no available slots for students at the moment.',
      icon: 'info',
      confirmButtonColor: '#00509e',
    });
    return;
  }

  const randomSlotsList = [...available]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  setRandomSlots(randomSlotsList);
};


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

  const handleSeeMore = useCallback(
    () => setVisibleSlot(slots.length),
    [slots.length]
  );

  const displayedSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (!user) return false;
      const matchesRole =
        user.userType === 'Student'
          ? slot.slotUser === 'Student'
          : user.userType === 'Staff'
          ? slot.slotUser === 'Staff'
          : true;

      const matchesType =
        selectedType === 'All' || slot.slotType === selectedType;
      const isAvailable = !showAvailableOnly || slot.slotStatus === 'Available';
      return matchesRole && matchesType && isAvailable;
    });
  }, [slots, showAvailableOnly, selectedType, user?.userType]);

  useEffect(() => {
    const handleUpdated = (updatedSlot) => {
      setSlots((prev) =>
        prev.map((slot) => (slot._id === updatedSlot._id ? updatedSlot : slot))
      );

      setRandomSlots((prev) =>
        prev.map((slot) => (slot._id === updatedSlot._id ? updatedSlot : slot))
      );
    };
    const handleCreated = (createdSlot) => {
      setSlots((prev) => [...prev, createdSlot]);
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
      try {
        const res = await UserAPI.get('/slots');
        setSlots(res.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, []);

  return (
    <>
      <UserHeader />

      <div className="min-h-screen px-6 py-8">
        <div className="hidden md:block mb-4">
          <BackButton onClick={() => navigate('/dashboard')} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-semibold text-[#00509e]">
            Parking Slots
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRandomSlot}
              className="flex items-center gap-2 bg-white border border-[#00509e]/20 hover:bg-[#00509e]/10 text-[#00509e] cursor-pointer text-sm px-3 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Get Random Slot
            </button>

            {randomSlots ? (
              <button
                onClick={handleShowAllSlots}
                className="flex items-center gap-2 cursor-pointer bg-[#00509e] text-white px-3 py-2 rounded-lg hover:bg-[#003f7d] transition text-sm"
              >
                <ListBulletIcon className="w-5 h-5" />
                Show All Slots
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowAvailableOnly((prev) => !prev);
                  setVisibleSlot(9);
                }}
                className="flex items-center gap-2 bg-[#00509e] text-white px-3 py-2 rounded-lg hover:bg-[#003f7d] transition text-sm"
              >
                {showAvailableOnly ? (
                  <>
                    <ListBulletIcon className="w-5 h-5" /> Show All Slots
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-5 h-5" /> Show Available
                  </>
                )}
              </button>
            )}

            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setVisibleSlot(9);
              }}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm "
            >
              {slotTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loader text="Loading slots..." />
        ) : displayedSlots.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No parking slots available.
          </p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          >
            {(randomSlots.length > 0 ? randomSlots : displayedSlots.slice(0, visibleSlot)).map(
          (slot) => (
                <motion.div
                  key={slot._id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition duration-300 w-full max-w-sm"
                >
                  <img
                    src={getSlotImage(slot.slotType)}
                    alt={slot.slotType}
                    className="w-24 mb-3"
                  />
                  <p className="text-gray-600">
                    <strong className="text-[#00509e]">Slot Number:</strong>{' '}
                    {slot.slotNumber}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-[#00509e]">Type:</strong>{' '}
                    {slot.slotType}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-[#00509e]">Price:</strong> ₱
                    {slot.slotPrice}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-[#00509e]">Status:</strong>{' '}
                    <span
                      className={
                        slot.slotStatus === 'Available' ? 'text-green-600' : slot.slotStatus === 'Reserved' ? 'text-yellow-600' : slot.slotStatus === 'Occupied' ? 'text-red-600' : 'text-blue-600'
                      }
                    >
                      {slot.slotStatus}
                    </span>
                  </p>

                  <button
                    onClick={() => handleReserve(slot._id)}
                    disabled={slot.slotStatus !== 'Available'}
                    className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      slot.slotStatus === 'Available'
                        ? 'bg-[#00509e] text-white hover:bg-[#003f7d]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {slot.slotStatus === 'Available' ? 'Reserve Now' : 
                    slot.slotStatus === 'Ongoing Maintenance' ? 'Ongoing Maintenance' : 
                    slot.slotStatus === 'Reserved' ? 'Reserved' : 
                    slot.slotStatus === 'Occupied' ? 'Occupied' : 
                    'Available'}
                  </button>
                </motion.div>
              )
            )}
          </motion.div>
        )}

        {displayedSlots.length > visibleSlot && !randomSlots && (
          <div className="flex justify-center mt-8">
            <ShowMore onClick={handleSeeMore} />
          </div>
        )}
      </div>
    </>
  );
};

export default Spots;
