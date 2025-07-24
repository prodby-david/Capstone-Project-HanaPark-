import Slot from "../../../models/slot.js";


const DeleteSlot = async (req,res) => {
  try{
    const { id } = req.params;

    const deleteSlot = await Slot.findByIdAndDelete(id);
    
    if(!deleteSlot){
      return res.status(404).json({message: 'Slot not found.'});
    }

    req.io.emit('slotDeleted', id);
    res.status(200).json({message: 'Slot deleted successfully.'});

  }catch(err){
    console.error('Error deleting slot:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

}

export default DeleteSlot;