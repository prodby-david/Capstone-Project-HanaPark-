import UserLog from '../../../models/userlog.js';


const getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find()
      .populate("userId", "firstname lastname userType") 
      .sort({ createdAt: -1 }); 

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default getUserLogs;
