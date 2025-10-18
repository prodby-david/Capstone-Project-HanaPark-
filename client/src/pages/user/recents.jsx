import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/headers/userHeader';
import UserAPI from '../../lib/inteceptors/userInterceptor';
import { XMarkIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import Step5 from '../../components/reservation/step5/step5';
import Loader from '../../components/loaders/loader';
import { socket } from '../../lib/socket';
import BackButton from '../../components/buttons/backbutton';
import CustomPopup from '../../components/popups/popup';

const Recents = () => {
  const navigate = useNavigate();
  const increment = 3;

  const [reservations, setReservations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [counts, setCounts] = useState({
    Pending: 3,
    Active: 3,
    Completed: 3,
    Cancelled: 3
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [latestReservation, setLatestReservation] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const getUserHistory = async () => {
      setLoading(true);
      try {
        const res = await UserAPI.get('/recents');
        const allReservations = [
          ...res.data.pendingReservation.map(r => ({ ...r, status: 'Pending' })),
          ...res.data.activeReservation.map(r => ({ ...r, status: 'Reserved' })),
          ...res.data.completeReservation.map(r => ({ ...r, status: 'Completed' })),
          ...res.data.cancelledReservation.map(r => ({ ...r, status: 'Cancelled' }))
        ];
        setReservations(allReservations);
        if (res.data.latestReservation) setLatestReservation(res.data.latestReservation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUserHistory();
  }, []);

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
    const query = searchQuery.toLowerCase();
    const reservedByName = r.reservedBy ? `${r.reservedBy.lastname} ${r.reservedBy.firstname}`.toLowerCase() : '';
    return reservedByName.includes(query) || r.plateNumber?.toLowerCase().includes(query) || r.verificationCode?.toLowerCase().includes(query);
  });

  const filteredReservationsByStatus = status => filteredReservations.filter(r => r.status === status);

  const handleCancelReservation = async (id) => {
    setPopup({
      show: true,
      type: "warning",
      title: "Cancel Reservation?",
      message: "You won't be able to revert this action.",
      onConfirm: async () => {
        setPopup({ ...popup, show: false });
        setCancelLoading(true);
        try {
          const res = await UserAPI.patch(`/cancel/${id}`);
          setPopup({
            show: true,
            type: "success",
            title: "Cancelled!",
            message: res.data.message,
            onConfirm: () => setPopup({ ...popup, show: false }),
          });
          setReservations((prev) =>
            prev.map((r) =>
              r._id === id ? { ...r, status: "Cancelled" } : r
            )
          );
        } catch (err) {
          setPopup({
            show: true,
            type: "error",
            title: "Error",
            message:
              err.response?.data?.message ||
              "An error occurred while cancelling the reservation.",
            onConfirm: () => setPopup({ ...popup, show: false }),
          });
        } finally {
          setCancelLoading(false);
        }
      },
    });
  };

  const handleViewMore = (status) => setCounts(prev => ({ ...prev, [status]: filteredReservationsByStatus(status).length }));
  const handleViewLess = (status) => setCounts(prev => ({ ...prev, [status]: increment }));

  const statusTabs = ['Pending', 'Reserved', 'Completed', 'Cancelled'];

  const handleBack = () => navigate('/dashboard');

  return (
    <>
      <UserHeader />

      <div className="hidden md:block p-5">
        <BackButton onClick={handleBack} />
      </div>

      <div className="pb-10 px-5">
        <div className="text-center my-5">
          <h2 className="text-2xl font-bold text-color">Your Recent Reservations</h2>
          <p className="text-sm text-gray-500">Manage and track all your reservations in one place.</p>
        </div>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, plate number or code"
            className="px-5 py-3 text-sm border border-gray-300 rounded-lg shadow-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {statusTabs.map(status => (
            <button
              key={status}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {loading && <Loader />}

        <div className="px-2 md:px-5">
          {filteredReservationsByStatus(selectedStatus).length === 0 ? (
            <div className="text-center text-gray-500 mt-12">No {selectedStatus.toLowerCase()} reservations found.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-lg">
              <div className="min-w-[700px] w-full">
                <div
                  className={`grid gap-4 bg-blue-50 text-sm font-semibold text-gray-700 p-4 text-center rounded-t-2xl ${
                    selectedStatus === 'Completed' || selectedStatus === 'Cancelled'
                      ? 'grid-cols-6'
                      : 'grid-cols-7'
                  }`}
                >
                  <div>Reservation Code</div>
                  <div>Slot Code</div>
                  <div>Slot Type</div>
                  <div>Price (₱)</div>
                  <div>Vehicle</div>
                  <div>Plate #</div>
                  {selectedStatus !== 'Completed' && selectedStatus !== 'Cancelled' && <div>Actions</div>}
                </div>


                <div className="max-h-[420px] overflow-y-auto">
                  {filteredReservationsByStatus(selectedStatus)
                    .slice(0, counts[selectedStatus])
                    .map(r => (
                      <div
                          key={r._id}
                          className={`grid gap-4 items-center text-sm bg-white transition p-4 border-t border-gray-100 text-center ${
                            selectedStatus === 'Completed' || selectedStatus === 'Cancelled'
                              ? 'grid-cols-6'
                              : 'grid-cols-7'
                          }`}
                        >

                        <div className="truncate font-medium text-gray-800" title={r.verificationCode}>{r.verificationCode}</div>
                        <div>{r.slotCode}</div>
                        <div>{r.slotId?.slotType}</div>
                        <div>{r.slotId?.slotPrice}</div>
                        <div>{r.vehicleType}</div>
                        <div>{r.plateNumber}</div>
                        {selectedStatus !== 'Completed' && selectedStatus !== 'Cancelled' && (
                        <div className="flex flex-col md:flex-row gap-2 justify-center">
                          {latestReservation && r._id === latestReservation._id && (
                            <button
                              onClick={() => setShowQR(true)}
                              className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full text-xs hover:opacity-90 transition-all cursor-pointer"
                            >
                              <QrCodeIcon className="w-4 h-4" />
                              <span>View QR</span>
                            </button>
                          )}
                          {r.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelReservation(r._id)}
                              className="flex items-center justify-center gap-1 bg-red-500 text-white px-4 py-2 rounded-full text-xs hover:bg-red-600 transition-all cursor-pointer"
                            >
                              <XMarkIcon className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      )}

                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 text-sm">
            {counts[selectedStatus] < filteredReservationsByStatus(selectedStatus).length && (
              <button onClick={() => handleViewMore(selectedStatus)} className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer">
                View More
              </button>
            )}
            {counts[selectedStatus] > increment && (
              <button onClick={() => handleViewLess(selectedStatus)} className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer">
                View Less
              </button>
            )}
          </div>
        </div>
      </div>

      {showQR && latestReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 mx-5">
          <div className="bg-white rounded-2xl shadow-xl p-6 relative max-w-md w-full">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowQR(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <Step5 reservationResult={latestReservation} navigate={navigate} />
          </div>
        </div>
      )}

      {loading ? <Loader text='Showing your activities...'/> : null}
      {cancelLoading && <Loader text="Cancelling your reservation..." />}

      <CustomPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
        onConfirm={popup.onConfirm}
      />
    </>
  );
};

export default Recents;
