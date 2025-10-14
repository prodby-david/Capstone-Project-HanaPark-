import Activity from "../../models/activitylog.js";

const getActivityLogs = async (req, res) => {
  try {
    const logs = await Activity.find()
      .populate('reservedBy', 'firstname lastname userType')
      .sort({ createdAt: -1 }); 

    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activity logs', error: err.message });
  }
};

export default getActivityLogs
