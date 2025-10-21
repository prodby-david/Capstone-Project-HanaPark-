import User from "../../../models/user.js";

const LockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked, lockReason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isLocked = isLocked;
    user.lockReason = lockReason || "";

    if (isLocked) {
      user.currentToken = null;
    }

    await user.save();

    res.status(200).json({
      message: isLocked ? "User account locked. Session invalidated." : "User account unlocked.",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user lock status.", error: err.message });
  }
};

export default LockUser;
