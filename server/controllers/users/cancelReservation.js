import Reservation from "../../models/reservation.js";
import Slot from "../../models/slot.js";

const CancelReservation = async (req,res) => {

    try {
        const { id } = req.params;   
        const userId = req.user?.userId;

        if(!userId){
            res.status(401).json({message: 'Unauthorized access. Please log in.'});
            return;
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            {status: 'Cancelled'},
            {new: true}
        )

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        await Slot.findByIdAndUpdate(
            reservation.slotId, 
            {slotStatus: 'Available'}, 
            {new: true}
        );

        await reservation.save();
        
        req.io.emit('reservationCancelled', reservation);

        res.status(200).json({ message: "Reservation cancelled successfully", reservation });

    } catch (err) {
        res.status(500).json({ message: "Error cancelling reservation", err });
    }
}

export default CancelReservation;