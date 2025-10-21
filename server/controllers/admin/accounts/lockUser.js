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

    if (isLocked) {
      user.currentToken = null; 
      user.lockReason = lockReason || "Locked by administrator";
      user.lockUntil = null;
      if (!user.violations) user.violations = [];
      user.violations.push({
        reason: lockReason || "Manual lock by admin",
        date: new Date(),
      });
    } else {
      user.lockReason = "";
      user.lockUntil = null;
      user.failedLoginAttempts = 0;
      user.currentToken = null; 
    }

    await user.save();

    res.status(200).json({
      message: isLocked
        ? "User account locked and violation recorded."
        : "User account unlocked successfully.",
      user,
    });
  } catch (err) {
    console.error("LockUser Error:", err);
    res.status(500).json({
      message: "Error updating user lock status.",
      error: err.message,
    });
  }
};

export default LockUser;
