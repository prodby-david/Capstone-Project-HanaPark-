import Reservation from "../../../models/reservation.js";
import Slot from "../../../models/slot.js";
import Notification from "../../../models/notification.js";

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

    // ✅ Entrance verification
    if (!reservation.isEntryUsed) {
      if (reservation.expiresAt < new Date()) {
        return res.status(400).json({ message: "QR code expired" });
      }

      reservation.status = "Reserved";
      reservation.isEntryUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Occupied" });
      await reservation.save();

      const notif = await Notification.create({
        userId: reservation.reservedBy._id,
        message: `Your QR code for slot ${reservation.slotId.slotCode} was verified. Reservation is now active.`,
      });

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Reserved" });
      req.io.emit("slotUpdated", { id: reservation.slotId, slotStatus: "Occupied" });
      req.io.to(reservation.reservedBy._id.toString()).emit("reservationVerified", notif);

      return res.status(200).json({ message: "Entrance verified. Reservation is now active." });
    }

    // ✅ Exit verification
    if (reservation.isEntryUsed && !reservation.isExitUsed) {
      reservation.status = "Completed";
      reservation.isExitUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Available" });
      await reservation.save();

      const notif = await Notification.create({
        userId: reservation.reservedBy._id,
        message: `Exit verified. Your reservation for slot ${reservation.slotId.slotCode} has been completed.`,
      });

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Completed" });
      req.io.emit("slotUpdated", { id: reservation.slotId, slotStatus: "Available" });
      req.io.to(reservation.reservedBy._id.toString()).emit("reservationCompleted", notif);

      return res.status(200).json({ message: "Exit verified. Reservation completed." });
    }

    return res.status(400).json({ message: "This QR code has already been used for both entrance and exit." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unexpected error occurred.", error: err.message });
  }
};

export default VerifyReservation;
