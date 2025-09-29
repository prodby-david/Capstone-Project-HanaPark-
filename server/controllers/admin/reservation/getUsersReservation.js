import Reservation from "../../../models/reservation.js";


const fetchReservation = async (req,res) => {

    try {
        const reservations = await Reservation.find()
        .populate("reservedBy", "firstname lastname userType studentId")
        .populate("slotId", "slotCode slotType").sort({ createdAt: -1 });
        
        res.status(200).json(reservations);
        
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user reservations", error: err.message });
    }
}

export default fetchReservation;