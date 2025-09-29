import Reservation from '../../../models/reservation.js'
import Slot from '../../../models/slot.js'

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

    await Slot.findByIdAndUpdate(
      reservation.slotId, 
      { slotStatus: 'Available' }, 
      { new: true }
    );

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('slotId')
      .populate('reservedBy');

    req.io.emit('reservationCancelledByAdmin', populatedReservation);

    res.status(200).json({ message: 'Reservation cancelled successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default cancelReservation;