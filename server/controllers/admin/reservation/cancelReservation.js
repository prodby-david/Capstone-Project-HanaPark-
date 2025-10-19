import Reservation from '../../../models/reservation.js'
import Slot from '../../../models/slot.js'
import Notification from '../../../models/notification.js'



const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndUpdate(
        id, 
        { status: 'Cancelled' }, 
        { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const updatedSlot = await Slot.findByIdAndUpdate(
      reservation.slotId, 
      { slotStatus: 'Available' }, 
      { new: true }
    );

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('slotId')
      .populate('reservedBy');

      const notif = await Notification.create({
      userId: populatedReservation.reservedBy._id,
      message: `Your reservation for slot ${populatedReservation.slotCode} has been cancelled by admin.`
      });

      req.io.to(populatedReservation.reservedBy._id.toString()).emit('cancelledReservationByAdmin', notif);
      req.io.to(populatedReservation.reservedBy._id.toString()).emit('reservationUpdated', populatedReservation);
      req.io.emit('slotUpdated', updatedSlot);
   
    res.status(200).json({ message: 'Reservation cancelled successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default cancelReservation;