import UserLog from "../../../models/userLog.js";


const createUserLog = async (req, res) => {
    try {
        const userId = req.user.userId;
        const  { action, description } = req.body;

        const newUserLog = new UserLog({
            userId,
            action,
            description,
        });
        await newUserLog.save();
        res.status(201).json({ message: "User log created successfully", userLog: newUserLog });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export default createUserLog;