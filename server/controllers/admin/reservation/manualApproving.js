import Reservation from "../../../models/reservation.js";
import Slot from "../../../models/slot.js";
import Notification from "../../../models/notification.js";
import Activity from "../../../models/activitylog.js";

const ApproveReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate("reservedBy")
      .populate("slotId");

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

      await Activity.create({
      reservationId: reservation._id,
      reservedBy: reservation.reservedBy._id,
      slotCode: reservation.slotCode,
      vehicleType: reservation.vehicleType,
      status: reservation.status, 
    });

      const notif = await Notification.create({
        userId: reservation.reservedBy._id,
        message: `Your reservation for slot ${reservation.slotCode} has been approved.`,
      });

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Reserved" });
      const updatedSlot = await Slot.findById(reservation.slotId);
      req.io.emit("slotUpdated", updatedSlot);

      req.io.to(reservation.reservedBy._id.toString()).emit("reservationApproved", notif);

      return res.status(200).json({ message: "Reservation approved. Slot is now occupied." });
    }

    if (reservation.isEntryUsed && !reservation.isExitUsed) {
      reservation.status = "Completed";
      reservation.isExitUsed = true;
      await Slot.findByIdAndUpdate(reservation.slotId, { slotStatus: "Available" });
      await reservation.save();

      await Activity.create({
      reservationId: reservation._id,
      reservedBy: reservation.reservedBy._id,
      slotCode: reservation.slotCode,
      vehicleType: reservation.vehicleType,
      status: reservation.status, 
    });

      const notif = await Notification.create({
        userId: reservation.reservedBy._id,
        message: `Your reservation for slot ${reservation.slotCode} has been completed. Thank you for using HanaPark!`,
      });

      req.io.emit("reservationUpdated", { id: reservation._id, status: "Completed" });
      const updatedSlot = await Slot.findById(reservation.slotId);
      req.io.emit("slotUpdated", updatedSlot);
      req.io.to(reservation.reservedBy._id.toString()).emit("reservationCompleted", notif);

      return res.status(200).json({ message: "Reservation completed." });
    }

    return res.status(400).json({ message: "Reservation already completed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unexpected error occurred.", error: err.message });
  }
};

export default ApproveReservation;
