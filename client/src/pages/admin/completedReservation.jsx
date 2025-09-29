import React, { useState, useEffect } from 'react'
import AdminAPI from '../../lib/inteceptors/adminInterceptor';
import AdminHeader from '../../components/headers/adminHeader';
import Loader from '../../components/loaders/loader';


const CompletedReservation = () => {

    const [completed, setCompleted]= useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getCompleted = async () => {
            setLoading(true);
            try {
                const res = await AdminAPI.get('/admin/reservations/completed');
                setCompleted(res.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        getCompleted();
    }, [])


  return (
    <>
    
        <AdminHeader />

        <h2 className='text-center mt-5 font-semibold text-color-3 text-xl'>Completed Reservations</h2>
        <div className='flex flex-col justify-center items-center gap-3 px-5 mt-5'>

            <div className="grid grid-cols-7 gap-3 w-full max-w-6xl bg-white text-color-3 p-4 rounded-xl font-semibold text-center">
                <p>Date and Time</p>
                <p>Reservation Code</p>
                <p>Slot Code</p>
                <p>Type</p>
                <p>Slot Price</p>
                <p>Vehicle</p>
                <p>Plate Number</p>
            </div>

            {completed.length === 0 ? (
                <div className='w-full bg-white p-5 rounded-md'>
                    <p className='text-center text-md font-semibold text-color-3'>No completed reservation.</p>
                </div>
            ) : (
            completed.map((complete) => (
                <div key={complete._id} className='grid grid-cols-7 text-center w-full max-w-6xl font-semibold text-color-2 bg-white p-5 rounded-md text-sm relative cursor-pointer hover:bg-gray-100'>
                    <p>{new Date(complete.createdAt).toLocaleString()}</p>
                    <p>{complete.verificationCode}</p>
                    <p>{complete.slotCode}</p>
                    <p>{complete.slotId.slotType}</p>
                    <p>{complete.slotPrice}</p>
                    <p>{complete.vehicleType}</p>
                    <p>{complete.plateNumber}</p>
                </div>
                ))
            )}

            </div>

        {loading ? (
            <div>

            </div>
        ) : (
            <div>

            </div>
        )}

        
    </>
  )
}

export default CompletedReservation
