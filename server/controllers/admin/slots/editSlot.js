import Slot from "../../../models/slot.js";
import Reservation from "../../../models/reservation.js";



const EditSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slotStatus, slotDescription } = req.body;
    
    const updatedSlot = await Slot.findByIdAndUpdate(id, { slotStatus, slotDescription }, { new: true });
    
     if (slotStatus === "Available") {
      await Reservation.updateMany(
        { slotId: id, status: "Reserved" },
        { $set: { status: "Completed" } }
      );
    }
    req.io.emit('slotUpdated', updatedSlot);

    res.status(200).json({ message: 'Slot updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update slot' });
  }
}

export default EditSlot;