import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import AdminHeader from '../../components/headers/adminHeader';
import SearchBar from '../../components/search/search';
import QRScanner from '../../lib/qrscanner';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { socket } from '../../lib/socket'
import Loader from '../../components/loaders/loader';

const UserReservationLists = () => {
  const [reservations, setReservations] = useState([]);
  const [counts, setCounts] = useState({
    Pending: 3,
    Reserved: 3,
    Completed: 3,
    Cancelled: 3,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [isLoading, setIsLoading] = useState(false);
  const increment = 3;


  useEffect(() => {
    socket.on('reservationCreated', (newReservation) => {
      setReservations((prev) => {
        const exists = prev.some(r => r._id === newReservation._id);
        return exists ? prev : [...prev, newReservation];
      });
    });
    socket.on('reservationCancelled', (cancelledReservation) => {
      setReservations((prev) =>
        prev.map(r =>
          r._id === cancelledReservation._id ? cancelledReservation : r
        )
      );
    });
    return () => {
      socket.off('reservationCreated');
      socket.off('reservationCancelled');
    };
  }, []);


  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const res = await AdminAPI.get('/admin/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleApprove = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to approve this reservation.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          await AdminAPI.post(`/admin/approve-reservation/${id}`);
          toast.success('Reservation approved successfully!', toastOptions);
          fetchReservations();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to approve reservation", toastOptions);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // Handle Complete
  const handleComplete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to complete this reservation.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminAPI.post(`/admin/approve-reservation/${id}`);
          toast.success("Reservation completed successfully!", toastOptions);
          fetchReservations();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to complete reservation", toastOptions);
        }
      }
    });
  };


  const handleCancelAdminReservation = async (reservationId) => {
    Swal.fire({
      title: 'Are you sure you want to cancel this reservation?',
      text: "This action can't be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00509e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminAPI.patch(`/admin/reservation/cancel/${reservationId}`);
          Swal.fire({
            title: 'Cancelled!',
            text: 'Reservation cancelled successfully.',
            icon: 'success',
            confirmButtonColor: '#00509e'
          });
          setReservations(prev => prev.filter(r => r._id !== reservationId));
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.response?.data?.message || 'Failed to cancel reservation',
            icon: 'error'
          });
        }
      }
    });
  };

  // Handle QR Scan
  const handleQRScan = async (scannedText) => {
    const verificationCode = scannedText.trim().toLowerCase();
    try {
      const res = await AdminAPI.post('/admin/verify-reservation', { verificationCode });
      toast.success(res.data.message, toastOptions);
      fetchReservations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify reservation', toastOptions);
    }
  };

  // Handle View More/Less
  const handleViewMore = (status) => {
    setCounts(prev => ({
      ...prev,
      [status]: filteredReservationsByStatus(status).length
    }));
  };
  const handleViewLess = (status) => {
    setCounts(prev => ({ ...prev, [status]: increment }));
  };

  const filteredReservations = reservations.filter(reservation => {
    const query = searchQuery.toLowerCase();
    const reservedByName = reservation.reservedBy
      ? `${reservation.reservedBy.lastname} ${reservation.reservedBy.firstname}`.toLowerCase()
      : '';
    return (
      reservedByName.includes(query) ||
      reservation.plateNumber?.toLowerCase().includes(query) ||
      reservation.verificationCode?.toLowerCase().includes(query)
    );
  });

  const filteredReservationsByStatus = (status) => {
    return filteredReservations.filter(r => r.status === status);
  }

  return (
    <>
      <AdminHeader />

      <div className='flex flex-col items-center justify-center py-5'>
        <div className='text-center my-5'>
          <h2 className='text-xl font-semibold text-color'>User Reservations List</h2>
          <p className='text-sm text-color-2'>Manage and track all user reservations in one place.</p>
        </div>

        <div className='flex justify-between items-center w-full px-5 mb-5'>
          <QRScanner onScanSuccess={handleQRScan}/>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Name, Reservation Code or Plate Number"/>
        </div>

        <div className="flex gap-3 justify-center mb-5">
          {['Pending', 'Reserved', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded font-semibold ${
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

        {/* Loader */}
        {isLoading && <Loader />}

        {/* Reservation Table */}
        <div className="px-5">
          {filteredReservationsByStatus(selectedStatus).length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              No {selectedStatus.toLowerCase()} reservations
            </div>
          ) : (
            filteredReservationsByStatus(selectedStatus).slice(0, counts[selectedStatus]).map(res => (
              <div key={res._id} className="grid grid-cols-7 gap-4 items-center w-full text-sm bg-white text-color-2 p-4 mt-2 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold">
                <div>{res.reservedBy ? `${res.reservedBy.lastname}, ${res.reservedBy.firstname}` : "Deleted User"}</div>
                <div>{res.slotCode} - {res.slotId?.slotType}</div>
                <div>{res.verificationCode}</div>
                <div>{res.plateNumber}</div>
                <div>{res.vehicleType}</div>
                <div>{res.reservationDate} {res.reservationTime}</div>
                <div>
                  {(selectedStatus === 'Pending') && (
                    <div className='flex items-center justify-center gap-x-2'>
                      <button onClick={() => handleApprove(res._id)}>
                        <CheckCircleIcon className='w-6 h-6 cursor-pointer hover:text-color-3'/>
                      </button>
                      <button onClick={() => handleCancelAdminReservation(res._id)}>
                        <XCircleIcon className='w-6 h-6 cursor-pointer hover:text-color-3'/>
                      </button>
                    </div>
                  )}
                  {(selectedStatus === 'Reserved') && (
                    <div className='flex items-center justify-center gap-x-2'>
                      <button onClick={() => handleComplete(res._id)}>
                        <CheckCircleIcon className='w-6 h-6 cursor-pointer hover:text-color-3'/>
                      </button>
                      <button onClick={() => handleCancelAdminReservation(res._id)}>
                        <XCircleIcon className='w-6 h-6 cursor-pointer hover:text-color-3'/>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end gap-2 mt-2">
            {counts[selectedStatus] < filteredReservationsByStatus(selectedStatus).length ? (
              <button onClick={() => handleViewMore(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3">View More</button>
            ) : counts[selectedStatus] > increment && (
              <button onClick={() => handleViewLess(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3">View Less</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserReservationLists;
