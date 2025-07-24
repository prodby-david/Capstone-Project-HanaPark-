import Slot from "../../../models/slot.js";



const EditSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slotStatus, slotDescription } = req.body;
    
    const updatedSlot = await Slot.findByIdAndUpdate(id, { slotStatus, slotDescription }, { new: true });
    console.log('Emitting slotUpdated for:', updatedSlot);
    req.io.emit('slotUpdated', updatedSlot);

    res.status(200).json({ message: 'Slot updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update slot' });
  }
}

export default EditSlot;