// controllers/admin/unarchiveUser.js
import User from "../../../models/user.js";

const UnarchiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'Active' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const archivedUsers = await User.find({ status: 'Archived' });
    res.status(200).json(archivedUsers);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export default UnarchiveUser;
