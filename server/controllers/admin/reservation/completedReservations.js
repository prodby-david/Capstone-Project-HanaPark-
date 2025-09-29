import Reservation from "../../../models/reservation.js";


const GetCompletedReservation = async (req,res) => {

    try {
        const completed = await Reservation.find({status: 'Completed'}).populate('reservedBy', 'firstname lastname').populate('slotId', 'slotCode slotType').sort({createdAt : -1});

        res.status(200).json(completed);
    } catch (err) {
        res.status(500).json({message: 'Unexpected error occured. Try again'})
    }
}

export default GetCompletedReservation;