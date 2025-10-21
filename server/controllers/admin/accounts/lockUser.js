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

    if (isLocked && lockReason) {
      if (!user.violations) user.violations = [];
      user.violations.push({
        reason: lockReason,
        date: new Date(),
      });
    }

    if (!isLocked) {
      user.lockReason = '';
    } else {
      user.lockReason = lockReason;
    }

    await user.save();

    res.status(200).json({message: isLocked ? "User account locked and violation recorded." : "User account unlocked.", user, });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user lock status.", error: err.message });
  }
};

export default LockUser;
