// controllers/admin/approveReservation.js
import Reservation from "../../../models/reservation.js";
import Slot from "../../../models/slot.js";

const ApproveReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id).populate("reservedBy").populate("slotId");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.expiresAt < new Date()) {
      return res.status(400).json({ message: "Reservation expired" });
    }

    if (!reservation.isEntryUsed) {
      reservation.status = "Reserved";
      reservation.isEntryUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Occupied" });
      await reservation.save();

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Reserved" });
      req.io.emit("slotUpdated", { id: reservation.slotId, slotStatus: "Occupied" });

      return res.status(200).json({ message: "Reservation approved. Slot is now occupied." });
    }

    if (reservation.isEntryUsed && !reservation.isExitUsed) {
      reservation.status = "Completed";
      reservation.isExitUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Available" });
      await reservation.save();

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Completed" });
      req.io.emit("slotUpdated", { id: reservation.slotId, slotStatus: "Available" });

      return res.status(200).json({ message: "Reservation completed." });
    }

    return res.status(400).json({ message: "Reservation already completed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unexpected error occurred.", error: err.message });
  }
};

export default ApproveReservation;
