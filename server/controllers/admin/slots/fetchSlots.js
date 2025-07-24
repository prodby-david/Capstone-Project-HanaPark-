import Slot from "../../../models/slot.js";



const FetchSlots = async (req, res) => {

  const { user, status } = req.query;

  try {

   const filter = {};

    if (user) filter.slotUser = user;
    if (status) filter.slotStatus = status;

    const slots = await Slot.find(filter);
    res.status(200).json(slots);

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving slots.' });
  }
}

export default FetchSlots;