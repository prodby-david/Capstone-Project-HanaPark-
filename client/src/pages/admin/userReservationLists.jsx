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

    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">User Reservations</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage and track all user reservations efficiently.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <QRScanner onScanSuccess={handleQRScan} />
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Name, Code, or Plate Number"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all shadow-sm ${
              selectedStatus === status
                ? 'bg-gradient-to-r from-[#3366CC] to-[#9460C9] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading && <Loader />}

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {filteredReservationsByStatus(selectedStatus).length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No {selectedStatus.toLowerCase()} reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <div
                className={`grid items-center text-sm font-semibold text-gray-700 bg-gradient-to-r from-[#3366CC]/10 to-[#9460C9]/10 px-6 py-4 ${
                  selectedStatus === 'Pending' || selectedStatus === 'Reserved'
                    ? 'grid-cols-9'
                    : 'grid-cols-8'
                }`}
              >
                <p>Name</p>
                <p>Verification Code</p>
                <p>Slot Code</p>
                <p>Slot Type</p>
                <p>Price</p>
                <p>Vehicle Type</p>
                <p>Plate Number</p>
                <p>Date & Time</p>
                {(selectedStatus === 'Pending' || selectedStatus === 'Reserved') && <p>Actions</p>}
              </div>

              {filteredReservationsByStatus(selectedStatus)
                .slice(0, counts[selectedStatus])
                .map((res) => (
                  <div
                    key={res._id}
                    className={`grid items-center text-sm text-gray-700 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${
                      selectedStatus === 'Pending' || selectedStatus === 'Reserved'
                        ? 'grid-cols-9'
                        : 'grid-cols-8'
                    }`}
                  >
                    <p className="font-medium">
                      {res.reservedBy
                        ? `${res.reservedBy.lastname}, ${res.reservedBy.firstname}`
                        : 'Deleted User'}
                    </p>
                    <p className="text-gray-600">{res.verificationCode}</p>
                    <p className="text-gray-600">{res.slotCode}</p>
                    <p className="text-gray-600">{res.slotId?.slotType}</p>
                    <p className="text-gray-600">₱{res.slotPrice}</p>
                    <p className="text-gray-600">{res.vehicleType}</p>
                    <p className="text-gray-600">{res.plateNumber}</p>
                    <p className="text-gray-600">
                      {res.reservationDate} {res.reservationTime}
                    </p>

                    {(selectedStatus === 'Pending' || selectedStatus === 'Reserved') && (
                      <div className="flex flex-col md:flex-row justify-center gap-2">
                        {selectedStatus === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(res._id)}
                              className="flex items-center justify-center gap-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleCancelAdminReservation(res._id)}
                              className="flex items-center justify-center gap-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                            >
                              <XCircleIcon className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        {selectedStatus === 'Reserved' && (
                          <button
                            onClick={() => handleComplete(res._id)}
                            className="flex items-center justify-center gap-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {counts[selectedStatus] < filteredReservationsByStatus(selectedStatus).length && (
          <button
            onClick={() => handleViewMore(selectedStatus)}
            className="text-sm font-medium text-[#3366CC] hover:underline"
          >
            View More
          </button>
        )}
        {counts[selectedStatus] > increment && (
          <button
            onClick={() => handleViewLess(selectedStatus)}
            className="text-sm font-medium text-[#9460C9] hover:underline"
          >
            View Less
          </button>
        )}
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
              setIsLoading(true)
              await Promise.resolve()
              try {
                await popup.onConfirm()
              } finally {
                setIsLoading(false)
                closePopup()
              }
            }
          : closePopup
      }
    />
  </>
)

};

export default UserReservationLists;
