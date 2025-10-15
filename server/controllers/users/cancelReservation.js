import Reservation from "../../models/reservation.js"; 
import Slot from "../../models/slot.js";
import Activity from '../../models/activitylogs.js'

const CancelReservation = async (req, res) => {
  try {
    const { id } = req.params;   
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: 'Cancelled' },
      { new: true }
    )
    .populate('reservedBy', 'firstname lastname userType studentId staffId');

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: 'Available' });

    const newActivity = new Activity({
      reservationId: reservation._id,
      reservedBy: reservation.reservedBy._id,
      slotCode: reservation.slotCode,  
      status: "Cancelled",
    });

    await newActivity.save();

    const populatedActivity = await Activity.findById(newActivity._id)
    .populate('reservedBy', 'firstname lastname userType studentId').lean();

    req.io.to('admins').emit('reservationCancelledByUser', populatedActivity);
 
    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling reservation", err });
  }
};

export default CancelReservation;
