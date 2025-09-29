import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserHeader from '../../components/headers/userHeader'
import UserAPI  from '../../lib/inteceptors/userInterceptor'
import { XMarkIcon, QrCodeIcon, ChevronRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Step5 from '../../components/reservation/step5/step5'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/loaders/loader'
import Swal from 'sweetalert2';
import { socket } from '../../lib/socket'

const Recents = () => {

  useEffect(() => {
      socket.on('reservationCancelledByAdmin', (cancelledReservation) => {
        setPendingReservation(prev => prev.filter(pending => pending._id !== cancelledReservation._id))
        setActiveReservation(prev => prev.filter(active => active._id !== cancelledReservation._id))
        setCancelledReservations(prev => [cancelledReservation, ...prev])
      })
  }, [])

  const [pendingReservation, setPendingReservation] = useState([]);
  const [activeReservation, setActiveReservation] = useState([]);
  const [cancelledReservations, setCancelledReservations] = useState([]);
  const [completeReservation, setCompleteReservation] = useState([]);
  const [latestReservation, setLatestReservation] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false)
  const [showCompleted, setShowCompleted] = useState(3);
  const [showCancelled, setShowCancelled] = useState(3);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const navigate = useNavigate();
const increment = 3; // how many to load each time

const handleViewMore = (section) => {
  if (section === 'Completed') {
    setShowCompleted((prev) => prev + increment);
  } else if (section === 'Cancelled') {
    setShowCancelled((prev) => prev + increment);
  }
};

const handleViewLess = (section) => {
  if (section === 'Completed') {
    setShowCompleted(increment);
  } else if (section === 'Cancelled') {
    setShowCancelled(increment);
  }
};

 
  useEffect(() => {
    const getUserHistory = async () => {

      setLoading(true)
      try {
        const res = await UserAPI.get('/recents');
        setPendingReservation(res.data.pendingReservation || []);
        setActiveReservation(res.data.activeReservation || []);
        setCompleteReservation(res.data.completeReservation || []);
        setCancelledReservations(res.data.cancelledReservation || [])

        if (res.data.latestReservation) {
          setLatestReservation(res.data.latestReservation);
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    getUserHistory();
  }, [])

  const handleCancelReservation = (reservationId) => {

    Swal.fire({
      title: 'Are you sure you want to cancel your reservation?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'    
    }).then(async (result) =>{
        if(result.isConfirmed){
          try {
            const res = await UserAPI.patch(`/cancel/${reservationId}`)
            Swal.fire({
              title: 'Reservation Cancelled!',
              text: res.data.message,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirm'    
            });

            setPendingReservation(prev => prev.filter(pending => pending._id !== reservationId))
            
          } catch (err) {
            
          }
        }
    })

  }



  return (
    <>
      <UserHeader />
      <div className='mt-10 py-5'>
        <div className='text-center'>
          <h2 className='text-center font-semibold text-color-3 text-xl'>Recent Activities</h2>
          <span className='text-sm text-color-2'>Stay updated with your most recent activities.</span>
        </div>
        

        {/* =========== Pending Reservation =========== */}
        <div className='flex flex-col gap-3 mt-5 px-10'>

          <div className='flex justify-between items-center'>

            <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-yellow-400 rounded-full animate-pulse'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Pending Reservation</h2>
            </div>
            
             {pendingReservation.length > 0 && latestReservation && (
                <button 
                  onClick={() => setShowQR(true)}
                  className='flex items-center gap-2 bg-color-3 text-white px-3 py-2 rounded-md cursor-pointer'>
                  <QrCodeIcon className='h-5 w-5 cursor-pointer' />
                  View QR Code
                </button>
              )}
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px] flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
              <div className='grid grid-cols-8 w-full font-semibold text-color-3 text-center bg-white p-5 rounded-md sticky top-0 z-10'>
                <h2>Reservation Code</h2>
                <p>Date and Time</p>
                <h2>Slot Code</h2>
                <h2>Slot Type</h2>
                <h2>Price (₱)</h2>
                <h2>Vehicle Type</h2>
                <h2>PN/MV File</h2>
                <h2>Actions</h2>
              </div>

              {pendingReservation.length === 0 ? (
                <div className='w-full bg-white p-5 rounded-md'>
                  <p className='text-center text-md font-semibold text-color-3'>You don't have any pending reservation. <Link to={'/spots'} className='underline text-color-2 hover:text-color-3'>Reserve Now?</Link></p>
                </div>
              ) : (
                pendingReservation.map((pending) => (
                  <div key={pending._id} className='grid grid-cols-8 items-center text-center w-full font-semibold text-color-2 bg-white p-5 rounded-md text-sm'>
                    <p>{pending.verificationCode}</p>
                    <p>{new Date(pending.createdAt).toLocaleString()}</p>
                    <p>{pending.slotCode}</p>
                    <p>{pending.slotId.slotType}</p>
                    <p>{pending.slotId.slotPrice}</p>
                    <p>{pending.vehicleType}</p>
                    <p>{pending.plateNumber}</p>
                    <div>
                      <button onClick={() => handleCancelReservation(pending._id)}>
                        <XMarkIcon className='h-5 w-5 bg-red-500 opacity-75 hover:opacity-100 text-white rounded-md cursor-pointer' title='Cancel Reservation' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* === Active Reservation === */}
        <div className='flex flex-col gap-3 mt-8 px-10'>

          <div className='flex justify-between items-center'>
            
            <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Active Reservation</h2>
            </div>

           {pendingReservation.length === 0 && activeReservation.length > 0 && latestReservation && (
                <button 
                  onClick={() => setShowQR(true)}
                  className='flex items-center gap-2 bg-color-3 text-white px-3 py-2 rounded-md cursor-pointer'>
                  <QrCodeIcon className='h-5 w-5 cursor-pointer' />
                  View QR Code
                </button>
              )}
          </div>


          <div className="overflow-x-auto">
            <div className="min-w-[900px] flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
              <div className='grid grid-cols-6 w-full font-semibold text-color-3 text-center bg-white p-5 rounded-md sticky top-0 z-10'>
                <h2>Reservation Code</h2>
                <h2>Slot Code</h2>
                <h2>Slot Type</h2>
                <h2>Price (₱)</h2>
                <h2>Vehicle Type</h2>
                <h2>PN/MV File</h2>
              </div>

              {activeReservation.length === 0 ? (
                <div className='w-full bg-white p-5 rounded-md'>
                  <p className='text-center text-md font-semibold text-color-3'>You don't have any active reservation. </p>
                </div>
              ) : (
                activeReservation.map((active) => (
                  <div key={active._id} className='grid grid-cols-6 text-center w-full font-semibold text-color-2 bg-white p-5 rounded-md text-sm'>
                    <p>{active.verificationCode}</p>
                    <p>{active.slotCode}</p>
                    <p>{active.slotId.slotType}</p>
                    <p>{active.slotId.slotPrice}</p>
                    <p>{active.vehicleType}</p>
                    <p>{active.plateNumber}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* === Completed Reservation === */}
        <div className='flex flex-col gap-3 mt-8 px-10'>

          <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Complete Reservation</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px] flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
              <div className='grid grid-cols-6 w-full font-semibold text-color-3 text-center bg-white p-5 rounded-md sticky top-0 z-10'>
                <h2>Reservation Code</h2>
                <h2>Slot Code</h2>
                <h2>Slot Type</h2>
                <h2>Price (₱)</h2>
                <h2>Vehicle Type</h2>
                <h2>PN/MV File</h2>
              </div>

              {completeReservation.length === 0 ? (
                <div className='w-full bg-white p-5 rounded-md'>
                  <p className='text-center text-md font-semibold text-color-3'>No completed reservation.</p>
                </div>
              ) : (
                completeReservation.slice(0, showCompleted).map((complete) => (
                  <div key={complete._id} className='grid grid-cols-6 text-center w-full font-semibold text-color-2 bg-white p-5 rounded-md text-sm relative cursor-pointer hover:bg-gray-100'
                  onClick={() => setSelectedReservation(complete)}>
                    <p>{complete.verificationCode}</p>
                    <p>{complete.slotCode}</p>
                    <p>{complete.slotId.slotType}</p>
                    <p>{complete.slotId.slotPrice}</p>
                    <p>{complete.vehicleType}</p>
                    <p>{complete.plateNumber}</p>
                    <ChevronRightIcon  className='w-5 h-5 absolute right-4 top-5 cursor-pointer'/>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
          {showCompleted < completeReservation.length && (
            <button
              onClick={() => handleViewMore('Completed')}
              className="text-sm underline text-color-2 hover:text-color-3 flex items-center gap-x-1 cursor-pointer"
            >
              View More <ArrowUpRightIcon className="w-4 h-4" />
            </button>
          )}
          {showCompleted > increment && (
            <button
              onClick={() => handleViewLess('Completed')}
              className="text-sm underline text-color-2 hover:text-color-3 flex items-center gap-x-1 cursor-pointer"
            >
              View Less
            </button>
          )}
        </div>

        </div>

          {/* === Cancelled Reservation === */}
        <div className='flex flex-col gap-3 mt-8 px-10'>

          <div className='flex items-center gap-x-1'>
              <div className='w-3 h-3 bg-red-500 rounded-full'></div>
              <h2 className='font-semibold text-color-3 text-lg'>Cancelled Reservation</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px] flex flex-col gap-3 max-h-96  pr-2">
              <div className=' grid grid-cols-6 w-full font-semibold text-color-3 text-center bg-white p-5 rounded-md sticky top-0 z-10'>
                <h2>Reservation Code</h2>
                <h2>Slot Code</h2>
                <h2>Slot Type</h2>
                <h2>Price (₱)</h2>
                <h2>Vehicle Type</h2>
                <h2>PN/MV File</h2>
              </div>

              {cancelledReservations.length === 0 ? (
                <div className='w-full bg-white p-5 rounded-md'>
                  <p className='text-center text-md font-semibold text-color-3'>No cancelled reservation.</p>
                </div>
              ) : (
                cancelledReservations.slice(0, showCancelled).map((cancelled) => (
                  <div key={cancelled._id} className='grid grid-cols-6 text-center w-full font-semibold text-color-2 bg-white p-5 rounded-md text-sm relative cursor-pointer hover:bg-gray-100'
                  onClick={() => setSelectedReservation(cancelled)}>
                    <p>{cancelled.verificationCode}</p>
                    <p>{cancelled.slotCode}</p>
                    <p>{cancelled.slotId?.slotType}</p>
                    <p>{cancelled.slotId?.slotPrice}</p>
                    <p>{cancelled.vehicleType}</p>
                    <p>{cancelled.plateNumber}</p>
                    <ChevronRightIcon  className='w-5 h-5 absolute right-4 top-5 cursor-pointer'/>
                  </div>
                ))
              )}
            </div>
          </div>

            <div className="flex justify-end gap-2">
          {showCancelled > increment && (
            <button
              onClick={() => handleViewLess('Cancelled')}
              className="text-sm underline text-color-2 hover:text-color-3 flex items-center gap-x-1 cursor-pointer"
            >
              View Less
            </button>
          )}
        </div>

        </div>

      </div>

      {showQR && latestReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowQR(false)}
            >
              <XMarkIcon className="w-6 h-6 cursor-pointer" />
            </button>
            <Step5 reservationResult={latestReservation} navigate={navigate} />
          </div>
        </div>
      )}

      {loading && <Loader text="Loading recent activities..." />}

      {selectedReservation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">

              <button 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                onClick={() => setSelectedReservation(null)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h2 className="text-lg font-semibold text-color-3 mb-4 text-center">Reservation Details</h2>

              <div className="space-y-2 text-color-2 text-sm">
                <p><strong>Reservation Code:</strong> {selectedReservation.verificationCode}</p>
                <p><strong>Slot Code:</strong> {selectedReservation.slotCode}</p>
                <p><strong>Slot Type:</strong> {selectedReservation.slotId.slotType}</p>
                <p><strong>Price (₱):</strong> {selectedReservation.slotId.slotPrice}</p>
                <p><strong>Vehicle Type:</strong> {selectedReservation.vehicleType}</p>
                <p><strong>Plate Number:</strong> {selectedReservation.plateNumber}</p>
                <p><strong>Created At:</strong> {new Date(selectedReservation.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedReservation.status}</p>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default Recents;
