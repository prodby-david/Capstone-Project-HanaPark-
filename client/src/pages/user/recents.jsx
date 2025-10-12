import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserHeader from '../../components/headers/userHeader'
import UserAPI from '../../lib/inteceptors/userInterceptor'
import { XMarkIcon, QrCodeIcon, ChevronRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Step5 from '../../components/reservation/step5/step5'
import Loader from '../../components/loaders/loader'
import Swal from 'sweetalert2'
import { socket } from '../../lib/socket'
import BackButton from '../../components/buttons/backbutton'

const Recents = () => {
  const navigate = useNavigate()
  const increment = 3

  const [reservations, setReservations] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('Pending')
  const [counts, setCounts] = useState({
    Pending: 3,
    Active: 3,
    Completed: 3,
    Cancelled: 3
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [latestReservation, setLatestReservation] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    const getUserHistory = async () => {
      setLoading(true)
      try {
        const res = await UserAPI.get('/recents')
        const allReservations = [
          ...res.data.pendingReservation.map(r => ({ ...r, status: 'Pending' })),
          ...res.data.activeReservation.map(r => ({ ...r, status: 'Reserved' })),
          ...res.data.completeReservation.map(r => ({ ...r, status: 'Completed' })),
          ...res.data.cancelledReservation.map(r => ({ ...r, status: 'Cancelled' }))
        ]
        setReservations(allReservations)
        if (res.data.latestReservation) setLatestReservation(res.data.latestReservation)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getUserHistory()
  }, [])

  useEffect(() => {
  const handleReservationUpdate = (updatedReservation) => {
    setReservations(prev =>
      prev.map(r =>
        r._id === (updatedReservation._id || updatedReservation.id)
          ? { ...r, ...updatedReservation }
          : r
      )
    );
  };

  socket.on('reservationUpdated', handleReservationUpdate);

  return () => socket.off('reservationUpdated', handleReservationUpdate);
}, []);

  const filteredReservations = reservations.filter(r => {
    const query = searchQuery.toLowerCase()
    const reservedByName = r.reservedBy ? `${r.reservedBy.lastname} ${r.reservedBy.firstname}`.toLowerCase() : ''
    return reservedByName.includes(query) || r.plateNumber?.toLowerCase().includes(query) || r.verificationCode?.toLowerCase().includes(query)
  })

  const filteredReservationsByStatus = status => filteredReservations.filter(r => r.status === status)

  const handleCancelReservation = async (id) => {
    Swal.fire({
      title: 'Cancel Reservation?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await UserAPI.patch(`/cancel/${id}`)
          Swal.fire('Cancelled!', res.data.message, 'success')
          setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r))
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  const handleViewMore = (status) => setCounts(prev => ({ ...prev, [status]: filteredReservationsByStatus(status).length }))
  const handleViewLess = (status) => setCounts(prev => ({ ...prev, [status]: increment }))

  const statusTabs = ['Pending', 'Reserved', 'Completed', 'Cancelled']

   const handleBack = () => {
      navigate('/dashboard');
  }

  return (
    <>
      <UserHeader />

      <div className='hidden md:block p-5'>
        <BackButton onClick={handleBack}/>
      </div>

      <div className="py-5 px-5">
        <div className="text-center my-5">
          <h2 className="text-xl font-semibold text-color">Your Recent Reservations</h2>
          <p className="text-sm text-color-2">Manage and track all your reservations in one place.</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, plate number or code"
            className="px-4 py-2 text-sm border rounded-md w-full max-w-md focus:shadow-md text-color-2"
          />
        </div>


        {/* Tabs */}
        <div className="flex flex-col md:flex-row gap-3 justify-center mb-5">
          {statusTabs.map(status => (
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

        {loading && <Loader />}

        <div className="px-5">
          {filteredReservationsByStatus(selectedStatus).length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No {selectedStatus.toLowerCase()} reservations
            </div>
          ) : (
           <div className="overflow-x-auto rounded-lg border border-gray-200">
              <div className="min-w-[700px] w-full">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 bg-gray-100 text-sm font-semibold text-gray-700 p-4 text-center sticky top-0 z-10">
                  <div>Reservation Code</div>
                  <div>Slot Code</div>
                  <div>Slot Type</div>
                  <div>Price (₱)</div>
                  <div>Vehicle Type</div>
                  <div>Plate Number</div>
                  <div>Actions</div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {filteredReservationsByStatus(selectedStatus)
                    .slice(0, counts[selectedStatus])
                    .map(r => (
                      <div 
                        key={r._id} 
                        className="grid grid-cols-7 gap-4 items-center text-sm bg-white text-color-2 p-4 border-t border-gray-100 hover:bg-gray-50 transition text-center"
                      >
                        <div className="truncate" title={r.verificationCode}>{r.verificationCode}</div>
                        <div>{r.slotCode}</div>
                        <div>{r.slotId?.slotType}</div>
                        <div>{r.slotId?.slotPrice}</div>
                        <div>{r.vehicleType}</div>
                        <div>{r.plateNumber}</div>
                        <div className="flex flex-col items-center justify-center gap-y-1">
                          {(r.status === 'Pending' || r.status === 'Reserved') ? (
                            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full">
                              {r.status === 'Pending' && (
                                <button 
                                  onClick={() => handleCancelReservation(r._id)}
                                  className='flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-full cursor-pointer hover:opacity-90 w-full sm:w-[140px] text-sm sm:text-base transition-all duration-200'
                                >
                                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="hidden md:inline">Cancel</span>
                                </button>
                              )}

                              {latestReservation && r._id === latestReservation._id && (
                                <button 
                                  onClick={() => setShowQR(true)}
                                  className='flex items-center justify-center gap-1 bg-color text-white px-3 py-2 rounded-full cursor-pointer hover:opacity-90 w-full sm:w-[140px] text-sm sm:text-base transition-all duration-200'
                                >
                                  <QrCodeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="hidden md:inline">View QR Code</span>
                                </button>
                              )}
                            </div>


                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* View More/Less */}
          <div className="flex justify-end gap-2 mt-2">
            {counts[selectedStatus] < filteredReservationsByStatus(selectedStatus).length && (
              <button onClick={() => handleViewMore(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3">View More</button>
            )}
            {counts[selectedStatus] > increment && (
              <button onClick={() => handleViewLess(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3">View Less</button>
            )}
          </div>
        </div>
      </div>

      {/* Show QR Modal */}
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

      {selectedReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setSelectedReservation(null)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-color-3 mb-4 text-center">Reservation Details</h2>
            <div className="space-y-2 text-color-2 text-sm">
              <p><strong>Reservation Code:</strong> {selectedReservation.verificationCode}</p>
              <p><strong>Slot Code:</strong> {selectedReservation.slotCode}</p>
              <p><strong>Slot Type:</strong> {selectedReservation.slotId?.slotType}</p>
              <p><strong>Price (₱):</strong> {selectedReservation.slotId?.slotPrice}</p>
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
