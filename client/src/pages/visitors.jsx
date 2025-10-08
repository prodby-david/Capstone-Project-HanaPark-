import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/headers/header';
import ShowMore from '../components/buttons/showmore';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../lib/motionConfigs';
import { publicApi } from '../lib/api';
import carimg from '../assets/carimg.png';
import smallbikeimg from '../assets/smallbikeimg.png';
import bigbikeimg from '../assets/bigbikeimg.png';
import Loader from '../components/loaders/loader';

const Visitors = () => {
  const [visitorSlots, setVisitorSlots] = useState([]);
  const [visibleSlot, setVisibleSlot] = useState(9);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVisitorSlots = async () => {
    try {
      const res = await publicApi.get('/visitors');
      setVisitorSlots(res.data);
    } catch (err) {
      console.error('Error fetching visitor slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorSlots();
  }, []);

  const getSlotImage = (type) => {
    switch (type) {
      case '2-Wheels (399cc below)': return smallbikeimg;
      case '2-Wheels (400cc up)': return bigbikeimg;
      case '4-Wheels': return carimg;
      default: return null;
    }
  };

  const handleReserve = (slotId) => {
    navigate(`/reservation-form/${slotId}`);
  };

  const handleSeeMore = useCallback(() => {
    setVisibleSlot(visitorSlots.length);
  }, [visitorSlots.length]);

  const displayedSlots = useMemo(() => visitorSlots.slice(0, visibleSlot), [visitorSlots, visibleSlot]);

  return (
    <>
      <Header />
      <div className="p-5 flex flex-col items-center gap-y-10">

        <div className="text-center">
          <h2 className="text-[28px] lg:text-[44px] font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
            Welcome, Guest!
          </h2>
          <p className="max-w-[600px] text-color-2 text-center mt-3">
            Easily check real-time parking availability, reserve a spot in advance, and ensure a hassle-free visit.
          </p>
        </div>

        {loading ? (
          <Loader text="Loading slots..." />
        ) : displayedSlots.length === 0 ? (
          <p className="text-color-2 text-center">No slots available.</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-5 w-full"
          >
            {displayedSlots.map(slot => (
              <motion.div
                key={slot._id}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.1 }}
                className="flex flex-col items-center justify-center shadow-sm shadow-color rounded-md p-5 w-full max-w-sm"
              >
                <div className="p-3 flex flex-col items-center">
                  <img src={getSlotImage(slot.slotType)} alt={slot.slotType} width={100} />
                  <p className="text-color-2 mt-2"><strong className="text-color-3">Slot Number:</strong> {slot.slotNumber}</p>
                  <p className="text-color-2"><strong className="text-color-3">Type:</strong> {slot.slotType}</p>
                  <p className="text-color-2"><strong className="text-color-3">Price:</strong> ₱ {slot.slotPrice}</p>
                  <p className="text-color-2"><strong className="text-color-3">Status:</strong> <span className={
                    slot.slotStatus === 'Available' ? 'text-green-600' :
                    slot.slotStatus === 'Reserved' ? 'text-yellow-600' :
                    slot.slotStatus === 'Occupied' ? 'text-red-600' :
                    'text-blue-600'
                  }>{slot.slotStatus}</span></p>
                </div>
                <button
                  onClick={() => handleReserve(slot._id)}
                  disabled={slot.slotStatus !== 'Available'}
                  className={`px-4 py-2 rounded mt-3 transition ${
                    slot.slotStatus === 'Available'
                      ? 'bg-color-3 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {slot.slotStatus === 'Available' ? 'Reserve Now' : 'Reserved'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {displayedSlots.length < visitorSlots.length && (
          <div className="flex justify-center mt-5">
            <ShowMore onClick={handleSeeMore} />
          </div>
        )}
      </div>
    </>
  );
};

export default Visitors;
