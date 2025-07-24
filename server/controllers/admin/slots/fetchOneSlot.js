import Slot from "../../../models/slot.js";


const FetchOneSlot = async (req,res) => {

    try {

        const { id } = req.params;
        const slot = await Slot.findById(id);
        res.json(slot);
        
    } catch (err) {
        console.error('Error fetching specific slot.', err);
    }

}

export default FetchOneSlot;