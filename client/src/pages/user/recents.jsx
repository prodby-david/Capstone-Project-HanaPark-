import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserHeader from '../../components/headers/userHeader'
import UserAPI from '../../lib/inteceptors/userInterceptor'
import { XMarkIcon, QrCodeIcon, ChevronRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Step5 from '../../components/reservation/step5/step5'
import Loader from '../../components/loaders/loader'
import Swal from 'sweetalert2'
import { socket } from '../../lib/socket'

const Recents = () => {
  const [reservations, setReservations] = useState([])
  const [latestReservation, setLatestReservation] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('Pending')
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [counts, setCounts] = useState({ Pending: 3, Active: 3, Completed: 3, Cancelled: 3 })
  const increment = 3
  const navigate = useNavigate()

  // Socket listener
  useEffect(() => {
    socket.on('reservationCancelledByAdmin', (cancelledReservation) => {
      setReservations(prev =>
        prev.map(r => r._id === cancelledReservation._id ? cancelledReservation : r)
      )
    })
    return () => socket.off('reservationCancelledByAdmin')
  }, [])

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true)
      try {
        const res = await UserAPI.get('/recents')
        const allReservations = [
          ...(res.data.pendingReservation || []),
          ...(res.data.activeReservation || []),
          ...(res.data.completeReservation || []),
          ...(res.data.cancelledReservation || [])
        ]
        setReservations(allReservations)
        if (res.data.latestReservation) setLatestReservation(res.data.latestReservation)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReservations()
  }, [])

  // Handle cancel
  const handleCancelReservation = (reservationId) => {
    Swal.fire({
      title: 'Are you sure you want to cancel your reservation?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await UserAPI.patch(`/cancel/${reservationId}`)
          Swal.fire('Cancelled!', res.data.message, 'success')
          setReservations(prev =>
            prev.map(r => r._id === reservationId ? { ...r, status: 'Cancelled' } : r)
          )
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  // View More / Less
  const handleViewMore = (status) => setCounts(prev => ({ ...prev, [status]: prev[status] + increment }))
  const handleViewLess = (status) => setCounts(prev => ({ ...prev, [status]: increment }))

  // Filter by status
  const filteredByStatus = (status) => reservations.filter(r => {
    if (status === 'Pending') return r.status === 'Pending'
    if (status === 'Active') return r.status === 'Reserved'
    if (status === 'Completed') return r.status === 'Completed'
    if (status === 'Cancelled') return r.status === 'Cancelled'
    return false
  })

  return (
    <>
      <UserHeader />
      <div className="mt-10 py-5 px-5">
        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold text-color-3">Recent Activities</h2>
          <span className="text-sm text-color-2">Stay updated with your most recent activities.</span>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-col md:flex-row justify-center gap-3 mb-5">
          {['Pending', 'Active', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded font-semibold ${selectedStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading && <Loader text="Loading reservations..." />}

        {/* Reservation Table */}
        {/* Status Title */}
        <div className="flex items-center gap-x-2 mb-3">
          <div
            className={`w-3 h-3 rounded-full ${
              selectedStatus === 'Pending'
                ? 'bg-yellow-400'
                : selectedStatus === 'Active'
                ? 'bg-blue-500'
                : selectedStatus === 'Completed'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          ></div>
          <h2 className="text-lg font-semibold text-color-3">{selectedStatus} Reservations</h2>
        </div>

        <div className="overflow-x-auto">
          
          <div className="min-w-[900px] flex flex-col gap-3">
            <div className="grid grid-cols-8 w-full font-semibold text-color-3 text-center bg-white p-5 rounded-md sticky top-0 z-10">
              <h2>Reservation Code</h2>
              <h2>Date & Time</h2>
              <h2>Slot Code</h2>
              <h2>Slot Type</h2>
              <h2>Price (₱)</h2>
              <h2>Vehicle Type</h2>
              <h2>Plate/MV</h2>
              <h2>Actions</h2>
            </div>

            {filteredByStatus(selectedStatus).length === 0 ? (
              <div className="w-full bg-white p-5 rounded-md text-center text-color-3 font-semibold">
                {selectedStatus === 'Pending' ? (
                  <>You don't have any pending reservations. <Link to="/spots" className="underline text-color-2 hover:text-color-3">Reserve Now?</Link></>
                ) : `No ${selectedStatus.toLowerCase()} reservations.`}
              </div>
            ) : (
              filteredByStatus(selectedStatus).slice(0, counts[selectedStatus]).map(res => (
                <div key={res._id} className="grid grid-cols-8 text-center items-center w-full font-semibold text-color-2 bg-white p-5 rounded-md text-sm hover:bg-gray-50 relative">
                  <p>{res.verificationCode}</p>
                  <p>{new Date(res.createdAt).toLocaleString()}</p>
                  <p>{res.slotCode}</p>
                  <p>{res.slotId?.slotType}</p>
                  <p>{res.slotId?.slotPrice}</p>
                  <p>{res.vehicleType}</p>
                  <p>{res.plateNumber}</p>
                  <div className="flex justify-center gap-2">
                    {selectedStatus === 'Pending' && (
                      <button onClick={() => handleCancelReservation(res._id)}>
                        <XMarkIcon className="w-5 h-5 bg-red-500 text-white rounded-md cursor-pointer opacity-75 hover:opacity-100" title="Cancel Reservation"/>
                      </button>
                    )}
                    <button onClick={() => setSelectedReservation(res)}>
                      <ChevronRightIcon className="w-5 h-5 cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* View More / Less */}
            <div className="flex justify-end gap-2 mt-2">
              {counts[selectedStatus] < filteredByStatus(selectedStatus).length && (
                <button onClick={() => handleViewMore(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3 flex items-center gap-x-1">
                  View More <ArrowUpRightIcon className="w-4 h-4"/>
                </button>
              )}
              {counts[selectedStatus] > increment && (
                <button onClick={() => handleViewLess(selectedStatus)} className="text-sm underline text-color-2 hover:text-color-3">
                  View Less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
       {selectedReservation && (
  <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={() => setSelectedReservation(null)}
      >
        <XMarkIcon className="w-6 h-6 cursor-pointer" />
      </button>
      <Step5 reservationResult={selectedReservation} navigate={navigate} />
    </div>
  </div>
)}

        {/* Reservation Details Modal */}
        {selectedReservation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => setSelectedReservation(null)}>
                <XMarkIcon className="w-6 h-6"/>
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
      </div>
    </>
  )
}

export default Recents
