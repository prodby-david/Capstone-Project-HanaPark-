import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'react-router-dom';
import AdminHeader from '../../components/headers/adminHeader';
import { motion } from 'framer-motion';
import { container, fadeUp } from '../../lib/motionConfigs';
import ShowMore from '../../components/buttons/showmore';
import { socket } from '../../lib/socket';
import { api } from '../../lib/api';
import Loader from '../../components/loaders/loader';
import CustomPopup from '../../components/popups/popup';

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
  const [isLoading, setIsLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false,
  });

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
    setIsLoading(true);
    try {
      await api.put(`/admin/slots/${selectedSlot._id}`, {
        slotStatus: editedStatus,
        slotDescription: editedDescription,
      });

      setPopup({
        show: true,
        type: 'success',
        title: 'Updated!',
        message: 'Slot updated successfully.',
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update error:', err);
      setPopup({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update slot.',
        onConfirm: () => setPopup({ ...popup, show: false }),
      }); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setPopup({
      show: true,
      type: 'warning',
      title: 'Are you sure you want to delete this slot?',
      message: "This can't be undone.",
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: async () => {
        setPopup({ ...popup, show: false });
        setIsLoading(true);
        try {
          await api.delete(`/admin/slots/${id}`);
          setPopup({
            show: true,
            type: 'success',
            title: 'Slot Removed',
            message: 'Slot deleted successfully.',
            onConfirm: () => setPopup({ ...popup, show: false }),
          });
          fetchSlots(filterUser, filterStatus);
        } catch (err) {
          console.error('Delete error:', err);
          setPopup({
            show: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to delete slot.',
            onConfirm: () => setPopup({ ...popup, show: false }),
          });
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => setPopup({ ...popup, show: false }),
    });
  };

  const fetchSlots = async (user = 'All', status = 'All') => {
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/admin/slots`;
      const query = [];
      if (user !== 'All') query.push(`user=${user}`);
      if (status !== 'All') query.push(`status=${status}`);
      if (query.length > 0) url += `?${query.join('&')}`;

      const res = await api.get(url);
      setShowSlots(res.data);
    } catch (err) {
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
    selectedUser === 'All' ? params.delete('user') : params.set('user', selectedUser);
    setSearchParams(params);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);
    const params = new URLSearchParams(searchParams);
    selectedStatus === 'All' ? params.delete('status') : params.set('status', selectedStatus);
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
      <div className="p-8 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-color flex items-center gap-2">
            <span className="bg-color-3 text-white px-3 py-1 rounded-lg text-base">Admin</span>
            Parking Slots
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="SlotFilter" className="text-sm text-color-3 font-semibold">
                Filter by:
              </label>
              <select
                id="SlotFilter"
                className="border border-gray-300 bg-white rounded-lg p-2 text-sm text-color-2 outline-none shadow-sm hover:border-color-3 transition"
                value={filterUser}
                onChange={handleUserChange}
              >
                <option value="All">All User</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>

            <select
              className="border border-gray-300 bg-white rounded-lg p-2 text-sm text-color-2 outline-none shadow-sm hover:border-color-3 transition"
              value={filterStatus}
              onChange={handleStatusChange}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Occupied">Occupied</option>
              <option value="Ongoing Maintenance">Ongoing Maintenance</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search slot number..."
                className="border border-gray-300 bg-white rounded-lg p-2 pl-9 text-sm text-color-2 outline-none shadow-sm hover:border-color-3 transition w-[180px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2.5 text-color-3" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : showSlots.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">No parking slots found.</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSlots.slice(0, visibleCount).map((slot) => (
              <motion.div
                key={slot._id}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.15 }}
                className="p-5 rounded-xl shadow-sm border border-gray-200 bg-white hover:shadow-lg transition duration-200 relative"
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-color-3">
                  {slot.slotStatus}
                </div>

                <h3 className="text-xl font-bold text-color mb-1">{slot.slotNumber}</h3>
                <p className="text-sm text-color-2">
                  <strong className="text-color-3">User:</strong> {slot.slotUser}
                </p>
                <p className="text-sm text-color-2">
                  <strong className="text-color-3">Type:</strong> {slot.slotType}
                </p>
                <p className="text-sm text-color-2">
                  <strong className="text-color-3">Price:</strong> ₱{slot.slotPrice}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {slot.slotDescription || 'No description provided.'}
                </p>

                <div className="flex justify-end mt-4 gap-x-3">
                  <button
                    onClick={() => openEditModal(slot)}
                    className="p-2 cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100 transition"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-color-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="p-2 cursor-pointer rounded-md bg-red-50 hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5 text-color-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {editModalOpen && (
          <motion.div
            key="backdrop"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-99"
          >
            <motion.div
              key="modal"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-color text-center">Edit Slot Details</h2>

              <div className="space-y-3">
                <div>
                  <label htmlFor="EditedStatus" className="text-sm font-semibold text-color-3 block mb-1">
                    Status
                  </label>
                  <select
                    id="EditedStatus"
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="w-full outline-none border border-gray-300 rounded-lg p-2 text-color-2 text-sm hover:border-color-3 transition"
                  >
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Occupied</option>
                    <option>Ongoing Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-color-3 block mb-1">Description</label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows="3"
                    className="w-full outline-none resize-none border border-gray-300 rounded-lg p-2 text-color-2 text-sm hover:border-color-3 transition"
                    placeholder="Write description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm cursor-pointer rounded-lg bg-color-3 text-white hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSlots.length > visibleCount && (
          <div className="text-center mt-6">
            <ShowMore onClick={handleShowMore} />
          </div>
        )}
      </div>

      {isLoading && <Loader text='Saving your changes...'/>}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        confirmText={popup.confirmText || 'OK'}
        cancelText={popup.cancelText || 'Cancel'}
        showCancel={popup.showCancel}
        onConfirm={popup.onConfirm}
        onClose={popup.onClose || (() => setPopup({ ...popup, show: false }))}
      />
    </>
  );
};

export default AvailableSlots;
