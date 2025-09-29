import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import AdminHeader from '../../components/headers/adminHeader';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import ShowMore from '../../components/buttons/showmore';
import { socket } from '../../lib/socket';
import { api } from '../../lib/api'
import Loader from '../../components/loaders/loader';

const AvailableSlots = () => {

    const [showSlots, setShowSlots] = useState([]);
    const [filterUser, setFilterUser] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editedStatus, setEditedStatus] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [ isLoading, setIsLoading] = useState(false);


    const filteredSlots = showSlots.filter(slot =>
      slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (slot) => {
    setSelectedSlot(slot);
    setEditedStatus(slot.slotStatus);
    setEditedDescription(slot.slotDescription);
    setEditModalOpen(true);
};

  const handleShowMore = () => {
    setVisibleCount(showSlots.length);
  };

    useEffect(() => {
    socket.on('slotUpdated', (updatedSlot) => {
      console.log('Slot updated in real time:', updatedSlot);

      setShowSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === updatedSlot._id ? updatedSlot : slot
        )
      );
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, []);


    const handleUpdate = async () => {
      
      try {
        await api.put(`http://localhost:4100/admin/slots/${selectedSlot._id}`, {
          slotStatus: editedStatus,
          slotDescription: editedDescription,
        });

        Swal.fire('Updated!', 'Slot updated successfully.', 'success');
        setEditModalOpen(false);
      } catch (err) {
        console.error('Update error:', err);
        Swal.fire('Error', 'Failed to update slot.', 'error');
      }
  };


    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this slot?',
            text: "This can't be undone.",
            icon: 'warning',
            confirmButtonColor: '#00509e',
            confirmButtonText: 'Confirm',
            showCancelButton: true,
        }).then(async (result) => {
            if(result.isConfirmed){
              setIsLoading(true);
                try{
                  await api.delete(`http://localhost:4100/admin/slots/${id}`);
                  Swal.fire({
                  title: 'Slot Removed',
                  text: "Slot deleted successfully.",
                  icon: 'success',
                  confirmButtonColor: '#00509e',
                });
                fetchSlots(filterUser, filterStatus);
                }
                catch(err){
                  console.error('Delete error:', err);
                  Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete slot.',
                    icon: 'error',
                  });
                } finally {
                  setIsLoading(false);
                }
            }
        })

    }

    const fetchSlots = async (user = 'All', status = 'All') => {
      setIsLoading(true);
    try {
    let url = 'http://localhost:4100/admin/slots';


    const query = [];
    if (user !== 'All') query.push(`user=${user}`);
    if (status !== 'All') query.push(`status=${status}`);
    if (query.length > 0) url += `?${query.join('&')}`;

    const res = await api.get(url);
    setShowSlots(res.data);
  }  catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      fetchSlots(filterUser, filterStatus);
    }, [filterUser, filterStatus]);

    const handleUserChange = (e) => {
        const selectedUser = e.target.value;
        setFilterUser(selectedUser);

        const params = new URLSearchParams(searchParams);
        if (selectedUser === 'All') {
            params.delete('user');
        } else {
            params.set('user', selectedUser);
        }
        setSearchParams(params);
};

    const handleStatusChange = (e) => {

    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);

    const params = new URLSearchParams(searchParams);
    if (selectedStatus === 'All') {
        params.delete('status');
    } else {
        params.set('status', selectedStatus);
    }
    setSearchParams(params);
};

 const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams);
    value ? params.set('search', value) : params.delete('search');
    setSearchParams(params);
  };


  return (
    <>

    <AdminHeader />
   
    <div className="p-10">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold text-color">All Parking Slots</h2>

        <div className='flex gap-x-2 items-center'>
            <label 
            htmlFor="SlotFilter"
            className='text-sm  text-color-3 font-semibold'
            >
                Filter by:
            </label>

             <select
            id='SlotFilter'
            className="border w-[100px] outline-0 cursor-pointer rounded p-2 text-sm text-color-2"
            value={filterUser}
            onChange={handleUserChange}
        >

            <option value="All">All User</option>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Visitor">Visitor</option>

        </select>

        <select
            className="border w-[100px] outline-0 cursor-pointer rounded p-2 text-sm text-color-2"
            value={filterStatus}
            onChange={handleStatusChange}
            >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
            <option value="Ongoing Maintenance">Ongoing Maintenance</option>
        </select>

        <div>
          <input
            type="text"
            placeholder="Search slot number"
            className=" relative border outline-0 rounded p-2 text-sm text-color-2 group"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <MagnifyingGlassIcon className='w-5 h-5 absolute top-25.5 right-13 text-color-3'/>
        </div>



        </div>

    </div>


      {isLoading ? ( 
  <Loader />
) : (
  showSlots.length === 0 ? (
    <p className="text-gray-500">No slots available.</p>
  ) : (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {showSlots
        .filter(slot => slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, visibleCount)
        .map((slot) => (
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
            key={slot._id}
            className="p-4 rounded-md shadow-md bg-white hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-color">{slot.slotNumber}</h3>
            <p className="text-color-2"><strong className="text-color-3">User:</strong> {slot.slotUser}</p>
            <p className="text-color-2"><strong className="text-color-3">Type:</strong> {slot.slotType}</p>
            <p className="text-color-2"><strong className="text-color-3">Slot Price:</strong> {`₱ ${slot.slotPrice}`}</p>
            <p className="text-color-2">
              <strong className="text-color-3">Status:</strong>{" "}
              <span className={
                slot.slotStatus === "Available" ? "text-green-600" :
                slot.slotStatus === "Reserved" ? "text-yellow-600" :
                slot.slotStatus === "Occupied" ? "text-red-600" :
                "text-blue-600"
              }>
                {slot.slotStatus}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">{slot.slotDescription}</p>
            <div className="flex justify-end gap-x-3">
              <button onClick={() => openEditModal(slot)}>
                <PencilSquareIcon className="w-5 h-5 text-color-3 hover:cursor-pointer" />
              </button>
              <button onClick={() => handleDelete(slot._id)}>
                <TrashIcon className="w-5 h-5 text-color-3 hover:cursor-pointer" />
              </button>
            </div>
          </motion.div>
        ))}
    </motion.div>
  )
)}

    </div>

    {editModalOpen && (
        <motion.div
        key="backdrop"
        variants={container}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="fixed inset-0 bg-white/10 backdrop-blur-xs bg-opacity-30 flex justify-center items-center z-50">
          <motion.div
          key="modal"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-color">Edit Slot</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-color-3"  htmlFor='EditedStatus'>Status</label>
              <select
              id='EditedStatus'
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="w-full outline-0 cursor-pointer border rounded p-2 text-color-2"
              >
                <option>Available</option>
                <option>Reserved</option>
                <option>Occupied</option>
                <option>Ongoing Maintenance</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-color-3">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full outline-0 border rounded p-2 text-color-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-red-500 px-4 py-2 rounded text-white cursor-pointer transition ease-in-out hover:opacity-75 duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className=" bg-blue-600 text-white px-4 p-2 rounded cursor-pointer transition ease-in-out hover:opacity-75 duration-300"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSlots.length > visibleCount && (
        <div className="text-center my-3">
          <ShowMore onClick={handleShowMore} />
        </div>
      )}


     </>
  )
}

export default AvailableSlots
