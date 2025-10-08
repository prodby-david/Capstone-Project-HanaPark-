import Slot from "../../models/slot.js";


const GetVisitorSlots = async (req, res) => {
    try {
        const visitor = await Slot.find({slotUser: 'Visitor'});
        res.status(200).json(visitor);
        
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch visitor slots", error: err.message });
    }
}

export default GetVisitorSlots;