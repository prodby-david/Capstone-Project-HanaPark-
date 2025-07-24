import Slot from '../../../models/slot.js';


const CreateSlot = async (req,res) => {

    try {

        const {slotUser, slotNumber, slotType, slotPrice, slotStatus, slotDescription } = req.body;

        const verifySlot = await Slot.findOne({slotNumber});
        if(verifySlot){
            return res.status(409).json({message: 'Slot Number already exist.'});
        }

        const newSlot= new Slot({slotUser, slotNumber, slotType, slotPrice, slotStatus, slotDescription});
        await newSlot.save();
        
        req.io.emit('slotCreated', newSlot);
        return res.status(201).json({ message: 'Slot created successfully.', success: true });
        
    } catch (err) {
        return res.status(500).json({message: 'Internal server error.'});
    }

}

export default CreateSlot;