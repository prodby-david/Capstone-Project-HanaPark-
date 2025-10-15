import Reservation from "../../models/reservation.js"; 
import Slot from "../../models/slot.js";
import Activity from "../../models/activitylog.js";

const CancelReservation = async (req, res) => {
  try {
    const { id } = req.params;   
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }

    // ✅ Step 1: Update the reservation
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: 'Cancelled' },
      { new: true }
    )
      .populate('reservedBy', 'firstname lastname userType studentId staffId')
      .populate('slotId', 'slotType slotCode slotPrice'); // ensure full slot info

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // ✅ Step 2: Update slot status
    await Slot.findByIdAndUpdate(reservation.slotId._id, { slotStatus: 'Available' });

    // ✅ Step 3: Log activity
    const newActivity = new Activity({
      reservationId: reservation._id,
      reservedBy: reservation.reservedBy._id,
      slotCode: reservation.slotId?.slotCode || "Unknown", // prevent undefined
      status: "Cancelled",
    });

    await newActivity.save();

    // ✅ Step 4: Emit to admins for real-time update
    req.io.to('admins').emit('reservationCancelledByUser', newActivity);

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation,
    });
  } catch (err) {
    console.error("CancelReservation Error:", err);
    res.status(500).json({
      message: "Error cancelling reservation",
      error: err.message,
    });
  }
};

export default CancelReservation;
