import User from "../../../models/user.js";

const LockUser = async (req, res) => {
  try {

    console.log("🟡 Incoming Lock Request:");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    
    const { id } = req.params;
    const { isLocked, lockReason } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isLocked, lockReason },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: isLocked ? 'User account locked.' : 'User account unlocked.', user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user lock status.", error: err.message });
  }
};

export default LockUser;
