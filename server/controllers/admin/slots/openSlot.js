import Slot from '../../../models/slot.js'
import Reservation from '../../../models/reservation.js'

const OpenSlot = async(req,res) => {

    try{
        const { slotId } = req.params;

        await Reservation.updateOne(
            { slotId, status: 'reserved' },
            { status: 'available' }
        );

        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { slotStatus: 'Available' },
            { new: true }
        );

        req.io.emit('slotUpdated', updatedSlot);

        res.status(200).json({message: 'Slot is now available.', success: true });

    }
    catch(err){
        res.status(500).json({message: 'Error while freeing the slot.', err});
    }

}

export default OpenSlot;