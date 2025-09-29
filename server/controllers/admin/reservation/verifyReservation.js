import Reservation from "../../../models/reservation.js";
import Slot from "../../../models/slot.js";


const VerifyReservation = async (req, res) => {
  try {
    let { verificationCode } = req.body;
    
    verificationCode = verificationCode.trim().toLowerCase();

    const reservation = await Reservation.findOne({ verificationCode })
      .populate("reservedBy")
      .populate("slotId");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (!reservation.isEntryUsed) {

      if (reservation.expiresAt < new Date()) {
        return res.status(400).json({ message: "QR code expired" });
      }
      reservation.status = "Reserved";       
      reservation.isEntryUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Occupied" });
      await reservation.save();

      req.io.emit('reservationUpdated', { id: reservation._id, status: "Reserved" });
      req.io.emit('slotUpdated', { id: reservation.slotId, slotStatus: "Occupied" });

      return res.status(200).json({ message: "Entrance verified. Reservation is now active." });
    }

    if (reservation.isEntryUsed && !reservation.isExitUsed) {
      reservation.status = "Completed";        
      reservation.isExitUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Available" });
      await reservation.save();

      req.io.emit('reservationUpdated', { id: reservation._id, status: "Completed" });
      req.io.emit('slotUpdated', { id: reservation.slotId, slotStatus: "Available" });

      return res.status(200).json({ message: "Exit verified. Reservation completed." });
    }

    return res.status(400).json({ message: "This QR code has already been used for both entrance and exit." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unexpected error occurred.", error: err.message });
  }
};

export default VerifyReservation;