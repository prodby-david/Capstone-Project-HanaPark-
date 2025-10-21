import User from '../../models/user.js'

const GetUserViolations = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("violations isLocked lockReason");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      violations: user.violations || [],
      isLocked: user.isLocked,
      lockReason: user.lockReason || "",
    });
  } catch (error) {
    console.error("Error fetching user violations:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default GetUserViolations;
