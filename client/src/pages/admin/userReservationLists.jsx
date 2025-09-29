import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import AdminHeader from '../../components/headers/adminHeader';
import SearchBar from '../../components/search/search';
import QRScanner from '../../lib/qrscanner';
import { toast } from 'react-toastify';
import toastOptions from '../../lib/toastConfig';
import { CheckCircleIcon, XCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
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
  const [ isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('reservationCreated', (newReservation) => {
       setReservations((prev) => {
        const exists = prev.some(r => r._id === newReservation._id);
        return exists ? prev : [...prev, newReservation];
      });
    })
    return () => {
    socket.off('reservationCreated'); 
  };
  }, []);

  useEffect(() => {
    socket.on('reservationCancelled', (cancelledReservation) => {
      setReservations((prev) =>
      prev.map(r =>
        r._id === cancelledReservation._id ? cancelledReservation : r
        )
      );
    })
    return () => {
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
    }finally {
      setIsLoading(false);
    }
  }

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
        const res = await AdminAPI.patch(`/admin/reservation/cancel/${reservationId}`);
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

  const increment = 3;

  const handleViewMore = (status) => {
    setCounts((prev) => ({
      ...prev,
      [status]: filteredReservations.filter(r => r.status === status).length
    }));
  };

  const handleViewLess = (status) => {
    setCounts((prev) => ({ ...prev, [status]: increment }));
  };


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
      if (result.isConfirmed){
        setIsLoading(true);
        try {
          const res = await AdminAPI.post(`/admin/approve-reservation/${id}`);
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
      if (result.isConfirmed){
        try {
          const res = await AdminAPI.post(`/admin/approve-reservation/${id}`);
          toast.success("Reservation completed successfully!", toastOptions);
          fetchReservations();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to approve reservation", toastOptions);
        }
      } 
    });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

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


  return (
    <>
      <AdminHeader />
      <div className='flex flex-col items-center justify-center py-5'>

        <div className='text-center my-5'>
          <h2 className='text-xl font-semibold text-color'>User Reservations List</h2>
          <p className='text-sm text-color-2'>Manage and track all user reservations in one place.</p>
        </div>
        

        {/* Top controls */}
        <div className='flex justify-between items-center w-full px-5 mb-2'>

          <QRScanner onScanSuccess={handleQRScan}/>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Name, Reservation Code or Plate Number"/>

        </div>

      </div>

      <div className='flex flex-col justify-center gap-y-5 py-5'>
        
        {/* --------- Pending Reservations ---------  */}
        <div className='flex flex-col justify-center px-5 gap-y-2'>

          <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-yellow-400 rounded-full animate-pulse'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Pending Reservations</h2>
          </div>

          <div className="grid grid-cols-8 gap-3 w-full bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
            <p>Reservist ID</p>
            <p>Reservist Name</p>
            <p>Slot Code & Type</p>
            <p>Reservation Code</p>
            <p>Plate Number</p>
            <p>Vehicle</p>
            <p>Date and Time</p>
            <p>Actions</p>
          </div>

          <div className='flex flex-col justify-center gap-y-2'>

            {filteredReservations.filter(pending => pending.status === 'Pending').length === 0 ? (
                <div className="w-full text-center text-gray-500 mt-4">
                  No pending reservations
                </div>
            ) : (
              filteredReservations.filter(pending => pending.status === 'Pending').slice(0, counts.Pending).map((pending) => (
          <div 
            key={pending._id} 
            className="grid grid-cols-8 gap-4 items-center w-full text-sm bg-white text-color-2 p-4 mt-2 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold"
          >
            <div>{pending.reservedBy.studentId}</div>
            <div>{pending.reservedBy ? `${pending.reservedBy.userType} - ${pending.reservedBy.lastname}, ${pending.reservedBy.firstname}` : "Deleted User"}</div>
            <div>{pending.slotCode} - {pending.slotId?.slotType}</div>
            <div>{pending.verificationCode}</div>
            <div>{pending.plateNumber}</div>
            <div>{pending.vehicleType}</div>
            <div>{pending.reservationDate} {pending.reservationTime}</div>
            <div>
              {pending.status === 'Pending' && (
                <div className='flex items-center justify-center gap-x-2 text-color-2'>
                  <button onClick={() => handleApprove(pending._id)}>
                    <CheckCircleIcon 
                      className='w-6 h-6 cursor-pointer hover:text-color-3' 
                      title='Approve Reservation'
                    />
                  </button>

                  <button onClick={() => handleCancelAdminReservation(pending._id)}>
                    <XCircleIcon 
                      className='w-6 h-6 cursor-pointer hover:text-color-3' 
                      title='Cancel Reservation'
                    />
                  </button>
                </div>
              )}
          </div>

        </div> 
        ))
      )}
    </div>
        <div className="flex justify-end gap-2">
            {counts.Pending < filteredReservations.filter(pending => pending.status === 'Pending').length ? (
              <button
                onClick={() => handleViewMore('Pending')}
                className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
              >
                View More
              </button>
            ) : counts.Pending > increment && (
              <button
                onClick={() => handleViewLess('Pending')}
                className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
              >
                View Less
              </button>
            )}
          </div>
        </div>
        
        <div className='flex flex-col justify-center px-5 gap-y-2'>

          {/* --------- Active Reservations ---------  */}
        <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Active Reservations</h2>
        </div>

        <div className="grid grid-cols-7 gap-3 w-full bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
          <p>Reservist Name</p>
          <p>Slot Code & Type</p>
          <p>Reservation Code</p>
          <p>Plate Number</p>
          <p>Vehicle</p>
          <p>Date and Time</p>
          <p>Actions</p>
        </div>

          {filteredReservations.filter(active => active.status === 'Reserved').length === 0 ? (
                <div className="w-full text-center text-gray-500 mt-4">
                  No active reservations
                </div>
            ) : (
              filteredReservations.filter(active => active.status === 'Reserved').slice(0, counts.Reserved).map((active) => (
          <div 
            key={active._id} 
            className="grid grid-cols-7 gap-4 items-center w-full text-sm bg-white text-color-2 p-4 mt-2 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold"
          >
            <div>{active.reservedBy ? `${active.reservedBy.lastname}, ${active.reservedBy.firstname}` : "Deleted User"}</div>
            <div>{active.slotCode} - {active.slotId?.slotType}</div>
            <div>{active.verificationCode}</div>
            <div>{active.plateNumber}</div>
            <div>{active.vehicleType}</div>
            <div>{active.reservationDate} {active.reservationTime}</div>
            <div>
              {active.status === 'Reserved' && (
                <div className='flex items-center justify-center gap-x-2 text-color-2'>
                  <button onClick={() => handleComplete(active._id)}>
                    <CheckCircleIcon 
                      className='w-6 h-6 cursor-pointer hover:text-color-3' 
                      title='Approve Reservation'
                    />
                  </button>

                  <button>
                    <XCircleIcon 
                      className='w-6 h-6 cursor-pointer hover:text-color-3' 
                      title='Cancel Reservation'
                    />
                  </button>
                </div>
              )}
          </div>
        </div> 
        ))
      )}

      <div className="flex justify-end gap-2">
        {counts.Reserved < filteredReservations.filter(active => active.status === 'Reserved').length ? (
          <button
            onClick={() => handleViewMore('Reserved')}
            className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
          >
            View More
          </button>
        ) : counts.Reserved > increment && (
          <button
            onClick={() => handleViewLess('Reserved')}
            className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
          >
            View Less
          </button>
        )}
      </div>

    </div>

      <div className='flex flex-col justify-center px-5 gap-y-2'>

            {/* --------- Completed Reservations ---------  */}
          <div className='flex items-center gap-x-1'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <h2 className='font-semibold text-color-3 text-lg'>Completed Reservations</h2>
          </div>

          <div className="grid grid-cols-7 gap-3 w-full bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
            <p>User Type</p>
            <p>Reservist Name</p>
            <p>Date and Time</p>
            <p>Reservation Code</p>
            <p>Plate Number</p>
            <p>Slot Code & Type</p>
            <p>Vehicle</p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">

          {filteredReservations.filter(completed => completed.status === 'Completed').length === 0 ? (
                <div className="w-full text-center text-gray-500 mt-4">
                  No completed reservations
                </div>
            ) : (
              filteredReservations.filter(completed => completed.status === 'Completed').slice(0, counts.Completed).map((completed) => (
          <div 
            key={completed._id} 
            className="grid grid-cols-7 gap-4 items-center w-full text-sm bg-white text-color-2 p-4 mt-2 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold"
          >
            <div>{completed.reservedBy.userType}</div>
            <div>{completed.reservedBy ? `${completed.reservedBy.lastname}, ${completed.reservedBy.firstname}` : "Deleted User"}</div>
            <div>{completed.reservationDate} {completed.reservationTime}</div>
            <div>{completed.verificationCode}</div>
            <div>{completed.plateNumber}</div>
            <div>{completed.slotCode} - {completed.slotId?.slotType}</div>
            <div>{completed.vehicleType}</div>
        </div> 
        ))
      )}
      </div>
      <div className="flex justify-end gap-2">
          {counts.Completed < filteredReservations.filter(complete => complete.status === 'Completed').length ? (
            <button
              onClick={() => handleViewMore('Completed')}
              className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
            >
              View More
            </button>
          ) : counts.Completed > increment && (
            <button
              onClick={() => handleViewLess('Completed')}
              className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
            >
              View Less
            </button>
          )}
        </div>
    </div>

        <div className='flex flex-col justify-center px-5 gap-y-2'>

          {/* --------- Cancelled Reservations ---------  */}
        <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-red-500 rounded-full'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Cancelled Reservations</h2>
        </div>

        <div className="grid grid-cols-6 gap-3 w-full bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
          <p>Reservist Name</p>
          <p>Date and Time</p>
          <p>Reservation Code</p>
          <p>Plate Number</p>
          <p>Slot Code & Type</p>
          <p>Vehicle</p>
          
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
        
        {filteredReservations.filter(cancelled => cancelled.status === 'Cancelled').length === 0 ? (
              <div className="w-full text-center text-gray-500 mt-4">
                No cancelled reservations
              </div>
          ) : (
            filteredReservations.filter(cancelled => cancelled.status === 'Cancelled').slice(0, counts.Cancelled).map((cancelled) => (
        <div 
          key={cancelled._id} 
          className="grid grid-cols-6 gap-4 items-center w-full text-sm bg-white text-color-2 p-4 mt-2 rounded-xl shadow-sm hover:shadow-md transition text-center font-semibold"
        >
          <div>{cancelled.reservedBy ? `${cancelled.reservedBy.lastname}, ${cancelled.reservedBy.firstname}` : "Deleted User"}</div>
          <div>{cancelled.reservationDate} {cancelled.reservationTime}</div>
          <div>{cancelled.verificationCode}</div>
          <div>{cancelled.plateNumber}</div>
          <div>{cancelled.slotCode} - {cancelled.slotId?.slotType}</div>
          <div>{cancelled.vehicleType}</div>
          
      </div> 
      ))
    )}
  </div>

    <div className="flex justify-end gap-2 ">
        {counts.Cancelled < filteredReservations.filter(cancel => cancel.status === 'Cancelled').length ? (
          <button
            onClick={() => handleViewMore('Cancelled')}
            className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
          >
            View More
          </button>
        ) : counts.Cancelled > increment && (
          <button
            onClick={() => handleViewLess('Cancelled')}
            className="text-sm underline cursor-pointer text-color-2 hover:text-color-3"
          >
            View Less
          </button>
        )}
      </div>

    

        </div>
      </div>
    </>
  )
}

export default UserReservationLists;
