import Reservation from "../../models/reservation.js";
import Slot from "../../models/slot.js";
import Activity from "../../models/activitylog.js"; // <-- add this

const CancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    )
      .populate("reservedBy", "firstname lastname userType studentId staffId")
      .populate("slotId", "slotType slotCode");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await Slot.findByIdAndUpdate(
      reservation.slotId,
      { slotStatus: "Available" },
      { new: true }
    );

    // ✅ Log the cancellation to Activity collection
    await Activity.create({
      reservedBy: reservation.reservedBy._id,
      slotCode: reservation.slotId.slotCode,
      slotType: reservation.slotId.slotType,
      timestamp: new Date(),
    });

    // ✅ Emit socket update (if using real-time updates)
    req.io.emit("reservationCancelled", reservation);

    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling reservation", err });
  }
};

export default CancelReservation;
