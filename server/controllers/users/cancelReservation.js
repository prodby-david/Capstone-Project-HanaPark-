import Reservation from "../../models/reservation.js";
import Slot from "../../models/slot.js";

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
      .populate('reservedBy', 'firstname lastname userType studentId staffId')
      .populate('slotId', 'slotType slotCode');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const updatedSlot = await Slot.findByIdAndUpdate(
      reservation.slotId,
      { slotStatus: "Available" },
      { new: true }
    );

    const payload = {
      _id: reservation._id,
      reservedBy: reservation.reservedBy,
      slotCode: reservation.slotId?.slotCode,
      slotType: reservation.slotId?.slotType,
      status: reservation.status,
      createdAt: new Date(),
    };

    req.io.to("admins").emit("reservationCancelledByUser", payload);
    req.io.emit("slotUpdated", updatedSlot);

    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (err) {
    console.error("Error cancelling reservation:", err);
    res.status(500).json({ message: "Error cancelling reservation", err });
  }
};

export default CancelReservation;
