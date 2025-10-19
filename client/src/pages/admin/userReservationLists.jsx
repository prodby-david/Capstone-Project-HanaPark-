import React, { useEffect, useState } from 'react';
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import AdminHeader from '../../components/headers/adminHeader';
import SearchBar from '../../components/search/search';
import QRScanner from '../../lib/qrscanner';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { socket } from '../../lib/socket';
import Loader from '../../components/loaders/loader';
import CustomPopup from '../../components/popups/popup';

const UserReservationLists = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [counts, setCounts] = useState({
    Pending: 3,
    Reserved: 3,
    Completed: 3,
    Cancelled: 3,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const increment = 3;

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinAdmin');
    });
    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    socket.on('reservationCreated', (newReservation) => {
      setReservations((prev) => {
        const exists = prev.some((r) => r._id === newReservation._id);
        return exists ? prev : [...prev, newReservation];
      });
    });

    socket.on('reservationCancelled', (cancelledReservation) => {
      setReservations((prev) =>
        prev.map((r) =>
          r._id === cancelledReservation._id ? cancelledReservation : r
        )
      );
    });

    socket.on('reservationCancelledByUser', (cancelledReservation) => {
      setReservations((prev) => {
        const exists = prev.some((r) => r._id === cancelledReservation._id);
        if (!exists) return prev;
        return prev.map((r) =>
          r._id === cancelledReservation._id ? cancelledReservation : r
        );
      });
    });

    socket.on('reservationApproved', (approvedReservation) => {
      setReservations((prev) =>
        prev.map((r) =>
          r._id === approvedReservation._id ? approvedReservation : r
        )
      );
    });

    socket.on('reservationUpdated', (updatedReservation) => {
      setReservations((prev) =>
        prev.map((r) =>
          r._id === updatedReservation._id ? updatedReservation : r
        )
      );
    });

    return () => {
      socket.off('reservationCreated');
      socket.off('reservationCancelled');
      socket.off('reservationCancelledByUser');
      socket.off('reservationApproved');
      socket.off('reservationUpdated');
    };
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const res = await AdminAPI.get('/admin/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const openPopup = (title, message, type = 'info', onConfirm = null) => {
    setPopup({ show: true, title, message, type, onConfirm });
  };
  const closePopup = () => setPopup((prev) => ({ ...prev, show: false }));

  const handleApprove = async (id) => {
    openPopup(
      'Are you sure?',
      'You are about to approve this reservation.',
      'warning',
      async () => {
        setIsLoading(true);
        try {
          await AdminAPI.post(`/admin/approve-reservation/${id}`);
          toast.success('Reservation approved successfully!', toastOptions);
          fetchReservations();
        } catch (err) {
          toast.error(
            err.response?.data?.message || 'Failed to approve reservation',
            toastOptions
          );
        } finally {
          setIsLoading(false);
          closePopup();
        }
      }
    );
  };

  const handleComplete = async (id) => {
    openPopup(
      'Mark as Completed?',
      'This will complete the reservation.',
      'warning',
      async () => {
        try {
          await AdminAPI.post(`/admin/approve-reservation/${id}`);
          toast.success('Reservation completed successfully!', toastOptions);
          fetchReservations();
        } catch (err) {
          toast.error(
            err.response?.data?.message || 'Failed to complete reservation',
            toastOptions
          );
        } finally {
          closePopup();
        }
      }
    );
  };

  const handleCancelAdminReservation = (reservationId) => {
    openPopup(
      'Cancel Reservation?',
      "This action can't be undone.",
      'warning',
      async () => {
        await AdminAPI.patch(`/admin/reservation/cancel/${reservationId}`);
        toast.success('Reservation cancelled successfully!', toastOptions);
        setReservations((prev) => prev.filter((r) => r._id !== reservationId));
      }
    );
  };


  const handleQRScan = async (scannedText) => {
    const verificationCode = scannedText.trim().toLowerCase();
    try {
      const res = await AdminAPI.post('/admin/verify-reservation', {
        verificationCode,
      });
      toast.success(res.data.message, toastOptions);
      fetchReservations();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to verify reservation',
        toastOptions
      );
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const query = searchQuery.toLowerCase();
    const reservedByName = res.reservedBy
      ? `${res.reservedBy.lastname} ${res.reservedBy.firstname}`.toLowerCase()
      : '';
    return (
      reservedByName.includes(query) ||
      res.plateNumber?.toLowerCase().includes(query) ||
      res.reservationCode?.toLowerCase().includes(query)
    );
  });

  const filteredReservationsByStatus = (status) =>
    filteredReservations.filter((r) => r.status === status);

  const handleViewMore = (status) => {
    setCounts((prev) => ({
      ...prev,
      [status]: filteredReservationsByStatus(status).length,
    }));
  };
  const handleViewLess = (status) => {
    setCounts((prev) => ({ ...prev, [status]: increment }));
  };

  const statusTabs = ['Pending', 'Reserved', 'Completed', 'Cancelled'];

  return (
    <>
      <AdminHeader />

      <div className="py-5 px-5">
        <div className="text-center my-5">
          <h2 className="text-xl font-semibold text-color">
            User Reservations List
          </h2>
          <p className="text-sm text-color-2">
            Manage and track all user reservations in one place.
          </p>
        </div>

        <div className="flex justify-between items-center w-full px-5 mb-5">
          <QRScanner onScanSuccess={handleQRScan} />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Name, Reservation Code or Plate Number"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-center mb-5">
          {statusTabs.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded font-semibold cursor-pointer ${
                selectedStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading && <Loader />}

        <div className="px-5">
          {filteredReservationsByStatus(selectedStatus).length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No {selectedStatus.toLowerCase()} reservations
            </div>
          ) : (
            <div className="overflow-auto h-80 rounded-lg border border-gray-200">
              <div className="min-w-[1000px] flex flex-col gap-2 p-4">

                <div
                  className={`grid gap-4 items-center bg-white text-color-3 font-bold text-sm p-4 rounded-t-lg text-center ${
                    selectedStatus === 'Pending' ||
                    selectedStatus === 'Reserved'
                      ? 'grid-cols-9'
                      : 'grid-cols-8'
                  }`}
                >
                  <div>Name</div>
                  <div>Verification Code</div>
                  <div>Slot Code</div>
                  <div>Slot Type</div>
                  <div>Price</div>
                  <div>Vehicle Type</div>
                  <div>Plate Number</div>
                  <div>Date & Time</div>
                  {(selectedStatus === 'Pending' ||
                    selectedStatus === 'Reserved') && <div>Actions</div>}
                </div>

                {filteredReservationsByStatus(selectedStatus)
                  .slice(0, counts[selectedStatus])
                  .map((res) => (
                    <div
                      key={res._id}
                      className={`grid gap-4 items-center bg-white text-color-2 text-sm p-4 rounded-t-lg text-center ${
                        selectedStatus === 'Pending' ||
                        selectedStatus === 'Reserved'
                          ? 'grid-cols-9'
                          : 'grid-cols-8'
                      }`}
                    >
                      <div>
                        {res.reservedBy
                          ? `${res.reservedBy.lastname}, ${res.reservedBy.firstname}`
                          : 'Deleted User'}
                      </div>
                      <div>{res.verificationCode}</div>
                      <div>{res.slotCode}</div>
                      <div>{res.slotId?.slotType}</div>
                      <div>{res.slotPrice}</div>
                      <div>{res.vehicleType}</div>
                      <div>{res.plateNumber}</div>
                      <div>
                        {res.reservationDate} {res.reservationTime}
                      </div>
                      {(selectedStatus === 'Pending' ||
                        selectedStatus === 'Reserved') && (
                        <div>
                          {selectedStatus === 'Pending' && (
                            <div className="flex flex-col justify-center gap-2">
                              <button
                                onClick={() => handleApprove(res._id)}
                                className="flex items-center justify-center gap-x-1 cursor-pointer bg-green-500  text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                <CheckCircleIcon className="w-5 h-5 " />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelAdminReservation(res._id)
                                }
                                className="flex items-center justify-center gap-x-1 cursor-pointer bg-red-500  text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                <XCircleIcon className="w-5 h-5 " />
                                Cancel
                              </button>
                            </div>
                          )}
                          {selectedStatus === 'Reserved' && (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleComplete(res._id)}
                                className="flex items-center justify-center gap-x-1 cursor-pointer bg-green-500  text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                <CheckCircleIcon className="w-5 h-5 " />
                                Complete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            {counts[selectedStatus] <
              filteredReservationsByStatus(selectedStatus).length && (
              <button
                onClick={() => handleViewMore(selectedStatus)}
                className="text-sm underline text-color-2 hover:text-color-3"
              >
                View More
              </button>
            )}
            {counts[selectedStatus] > increment && (
              <button
                onClick={() => handleViewLess(selectedStatus)}
                className="text-sm underline text-color-2 hover:text-color-3"
              >
                View Less
              </button>
            )}
          </div>
        </div>
      </div>

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onConfirm={
          popup.onConfirm
            ? async () => {
                setIsLoading(true);
                await Promise.resolve();
                try {
                  await popup.onConfirm();
                } finally {
                  setIsLoading(false);
                  closePopup();
                }
              }
            : closePopup
        }
      />
    </>
  );
};

export default UserReservationLists;
